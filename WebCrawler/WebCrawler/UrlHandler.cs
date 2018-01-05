using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Cache;
using System.Text;
using System.Threading.Tasks;
using WebCrawler.DatabaseModel;

namespace WebCrawler
{
    public abstract  class UrlHandler
    {
        protected string HtmlRawContent;
        protected string RootUrl;
        protected UrlHandler(string url)
        {
            RootUrl = url;
            try
            {
                HtmlRawContent = HtmlFetch(url);
            }
            catch (Exception e)
            {
                throw new Exception("Can not fetch content");
            }
        }

        public string GetRawContent()
        {
            return HtmlRawContent;
        }
        public string HtmlFetch(string url)
        {
            HttpWebRequest.DefaultCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            HttpWebRequest http = (HttpWebRequest)WebRequest.Create(url);
            http.UserAgent = @"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36";
            http.Proxy.Credentials = System.Net.CredentialCache.DefaultCredentials;
            WebResponse response = http.GetResponse();
            var stream = response.GetResponseStream();
            if (stream == null) throw new Exception("Can not fetch content");
            using (StreamReader sr = new StreamReader(stream))
            {
                string content = sr.ReadToEnd();
                string decodeUrl = WebUtility.UrlDecode(content);
             //   string decodeHtml = WebUtility.HtmlDecode(decodeUrl);
                return decodeUrl;
            }

        }

        public abstract List<string> GetHtmlUrlList();
        public abstract List<Source> GetTargetUrlList();
    }
}
