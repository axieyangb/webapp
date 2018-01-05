using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using MetadataExtractor;

namespace Blog.Helper
{
    public class ScreencaptureHelper
    {
        private readonly string _capturedApiUrl;
        private readonly string _capturedImageWidth;
        private ScreencaptureHelper()
        {
            _capturedApiUrl= System.Configuration.ConfigurationManager.AppSettings["pageCaptureUrl"];
            _capturedImageWidth = System.Configuration.ConfigurationManager.AppSettings["pageCaptureWidth"];
        }

        private static class ScreencaptureHelperInitializer
        {
            public static readonly ScreencaptureHelper Instance = new ScreencaptureHelper();
        }

        public static ScreencaptureHelper GetInstance()
        {
            return ScreencaptureHelperInitializer.Instance;
        }

        public string GetImageRelativePathByUrl(string path)
        {
            path=path.Split('?')[0];
            string[] pathTokens = path.Split('/');
            string fileName = string.Join("_", pathTokens,3,pathTokens.Length-3)+".jpg";
           string physicalRootPath = HttpContext.Current.Server.MapPath("~/Content/img/screenCaptures");
            string fileFullPath = Path.Combine(physicalRootPath, fileName);
            string apiFullPath = _capturedApiUrl + path + "&width=" + _capturedImageWidth;
            DownloadImage(apiFullPath, fileFullPath);
            return "/Content/img/screenCaptures/" + fileName;
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void DownloadImage(string apiPath, string filePath)
        {
            FileInfo file = new FileInfo(filePath);
            if (!file.Exists)
            {
                Thread t1 = new Thread(() =>
                {
                    using (WebClient client = new WebClient())
                    {
                        client.DownloadFileAsync(new Uri(apiPath), file.FullName);
                    }
                });
                t1.IsBackground = true;
                t1.Start();
                t1.Join();
            }
        }
    }

}