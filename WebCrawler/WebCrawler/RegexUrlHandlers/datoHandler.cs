using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebCrawler.DatabaseModel;

namespace WebCrawler.RegexUrlHandlers
{
    public class DatoHandler : UrlHandler
    {
        public DatoHandler(string url) : base(url)
        {
        }
        public override List<string> GetHtmlUrlList()
        {
            HashSet<string> ret = new HashSet<string>();
            MatchCollection matches = Regex.Matches(HtmlRawContent, "(\"http://dato.porn)[a-z/A-Z+_.0-9?=&-]+(\"|')");
            foreach (var oneMatch in matches)
            {
                String url = oneMatch.ToString().Replace("\"", "");
                if (url.EndsWith(".css") || url.EndsWith(".js") ||  url.EndsWith(".png") || url.EndsWith(".html")) continue;
                url=url.Replace("http://dato.porn", "");
                ret.Add(url);
            }
            return ret.ToList();
        }

        public override List<Source> GetTargetUrlList()
        {
            HashSet<Source> ret = new HashSet<Source>();
            MatchCollection matches = Regex.Matches(HtmlRawContent, @"(http:\/\/)[a-zA-Z://0-9\.]+(.mp4)");
            foreach (var oneMatch in matches)
            {
                Source oneSource = new Source();
                oneSource.Title = FetchTitle();
                oneSource.Duration = FetchDuration();
                oneSource.SourceUrl = oneMatch.ToString();
                var splits = oneSource.SourceUrl.Split('/');
                var type = "mp4";
                oneSource.SourceTypeName = type;
                ret.Add(oneSource);
            }
            return ret.ToList();
        }

        private string FetchTitle()
        {
            MatchCollection matches = Regex.Matches(HtmlRawContent, "(\"model-name\">)[a-zA-Z-0-9]+(</span>)");
            if (matches.Count > 0)
                return matches[0].ToString().Replace("\"model-name\">", "").Replace("</span>", "");
            return "";
        }

        private string FetchDuration()
        {
            MatchCollection matches = Regex.Matches(HtmlRawContent, "(duration:\")[0-9]+(\")");
            if (matches.Count > 0)
                return matches[0].ToString().Replace("duration:", "").Replace("\"","");
            return "";
        }
    }
}
