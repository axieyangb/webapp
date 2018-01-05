using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebCrawler.DatabaseModel;

namespace WebCrawler.RegexUrlHandlers
{
   public class AotuHandler : UrlHandler
    {
        public AotuHandler(string url) : base(url)
        {
        }

        public override List<string> GetHtmlUrlList()
        {
            HashSet<string> ret = new HashSet<string>();
            MatchCollection matches = Regex.Matches(HtmlRawContent, "(\"/[0-9]+/[^\"]+)|(\"/[a-zA-Z/]+[0-9]{1,3}/\")");
            foreach (var oneMatch in matches)
            {
                ret.Add(oneMatch.ToString().Replace("\"", ""));
            }
            return ret.ToList();
        }

       public override List<Source> GetTargetUrlList()
       {
           HashSet<Source> ret = new HashSet<Source>();
           MatchCollection matches = Regex.Matches(HtmlRawContent, "[^\"]+\\.mp4");
           foreach (var oneMatch in matches)
           {
                Source oneSource = new Source();
               oneSource.SourceUrl = oneMatch.ToString();
                oneSource.Title = FetchTitle();
                var splits = oneSource.SourceUrl.Split('/');
                var type = splits[splits.Length - 2];
                oneSource.SourceTypeName = type;
                ret.Add(oneSource);
            }
           return ret.ToList();
       }

       private string FetchTitle()
       {
            MatchCollection matches = Regex.Matches(HtmlRawContent, "<h1>[^<]+</h1>");
           if (matches.Count >0)
           {
               var title = matches[0].ToString().Replace("<h1>","").Replace("</h1>","");
               return title;
           }
           return "";
       }
    }
}
