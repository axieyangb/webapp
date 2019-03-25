using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;

namespace Blog.Helper
{
    public class CodeHelper
    {
        private readonly string apiUrl = "https://paiza.io/api/projects.json";
        private readonly string method = "POST";
        private readonly string contentType = "application/json";
        private CodeHelper()
        {
            
        }
        private static class CodeHelperInitializer
        {
            public static readonly CodeHelper InstanceCreationEditor = new CodeHelper();
        }

        public static CodeHelper GetIntance()
        {
            return CodeHelperInitializer.InstanceCreationEditor;
        }


        public async Task<string> RunCode(string codeDecoded, string filename, string language)
        {

            var request = (HttpWebRequest)WebRequest.Create(apiUrl);
            request.Method = method;
            request.ContentType = contentType;
            ScriptModel param = new ScriptModel();
            Project proj = new Project();
            param.project = proj;



            SourceFile file = new SourceFile();
            file.filename = filename;
            file.body = codeDecoded;

            proj.source_files = new SourceFile[1];
            proj.language = language;
            proj.source_files[0] = file;

            string paramStr = JsonConvert.SerializeObject(param);
            System.Console.Out.WriteLine(paramStr);
            request.ContentLength = paramStr.Length;
            byte[] paramBytes = Encoding.ASCII.GetBytes(paramStr);
            using (var stream = request.GetRequestStream())
            {
                stream.Write(paramBytes, 0, paramBytes.Length);
            }
            var response = (HttpWebResponse)await request.GetResponseAsync();
            using (Stream sm = response.GetResponseStream())
            {
                if (sm != null)
                {
                    var responseString = new StreamReader(sm).ReadToEnd();
                    return parseResult(responseString);
                }
            }
            return null;
        }


        private string parseResult(string responseStr)
        {
            dynamic returnData = JsonConvert.DeserializeObject(responseStr);
            string output = "";
            if (returnData.result == "success")
            {
                output = returnData.stdout;
            }
            else
            {
                output = returnData.build_stderr;
                if (string.IsNullOrEmpty(output))
                {
                    output = returnData.stderr;
                }
            }

            System.DateTime runAt =returnData.run_at;
            System.DateTime updateAt =returnData.updated_at;
            System.TimeSpan diff = updateAt.Subtract(runAt);
            double runTime =  diff.TotalMilliseconds / 1000.0;
            FromatedResult reformatedData = new FromatedResult();
            reformatedData.output = output;
            reformatedData.executeTime = runTime;
            return JsonConvert.SerializeObject(reformatedData);

        }
    }

    public class FromatedResult
    {
        public string output { get; set; }
        public double executeTime { get; set; }
    }

    public class ScriptModel
    {
        public Project project { get; set; }
        public bool run = true;
        public bool save = true;
     

    }

    public class Project
    {
        public SourceFile[] source_files;
        public string language { get; set; }
        public string share = "private";
        public bool network = true;
        public string output_type = null;
    }
    public class SourceFile
    {
        public string filename { get; set; }
        public string body { get; set; }
       
        public int position = 0;


        
    }
}