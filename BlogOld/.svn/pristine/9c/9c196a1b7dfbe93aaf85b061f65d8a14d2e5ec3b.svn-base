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
        private readonly string apiUrl = "https://www.jdoodle.com/api/execute";
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


        public async Task<string> RunCode(string codeDecoded, string language)
        {

            var request = (HttpWebRequest)WebRequest.Create(apiUrl);
            request.Method = method;
            request.ContentType = contentType;
            ScriptModel param = new ScriptModel();
            param.language = language;
            param.script = codeDecoded;
            string paramStr = JsonConvert.SerializeObject(param);
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
                    return responseString;
                }
            }
            return null;
        }
    }


    public class ScriptModel
    {
        public string script { get; set; }
        public string args { get; set; }
        public string stdin { get; set; }
        public string language { get; set; }
    }
}