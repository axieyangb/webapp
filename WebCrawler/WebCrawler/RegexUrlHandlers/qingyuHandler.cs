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
   public class QingyuHandler: UrlHandler
    {
        public QingyuHandler(string url) : base(url)
        {
        }

        public override List<string> GetHtmlUrlList()
        {
            HashSet<string> ret = new HashSet<string>();
            MatchCollection matches = Regex.Matches(HtmlRawContent, @"""\/[0-9]{1,4}\/[^""]+");
            foreach (var oneMatch in matches)
            {
                ret.Add(oneMatch.ToString().Replace("\"",""));
            }
            return ret.ToList();
        }

        public override List<Source> GetTargetUrlList()
        {
            HashSet<Source> ret = new HashSet<Source>();
            MatchCollection matches = Regex.Matches(HtmlContentForSource(), @"src=""[^""]+mp4""");
            foreach (var oneMatch in matches)
            {
                Source oneSource=new Source();
                oneSource.Title = FetchTitle();
                oneSource.Duration = FetchDuration();
                oneSource.SourceUrl =oneMatch.ToString().Replace("src=\"", "").Replace("\"", "");
                var splits = oneSource.SourceUrl.Split('/');
                var type = splits[splits.Length - 2];
                oneSource.SourceTypeName = type;
                ret.Add(oneSource);
            }
            return ret.ToList();
        }


       private string HtmlContentForSource()
       {
            var num = RootUrl.Replace("http://www.qyle9.com/", "").Split('/')[0];
           var newUrl = "http://www.qyle9.com/embed/" + num;
            return HtmlFetch(newUrl);
       }

       private string FetchTitle()
       {
            MatchCollection matches = Regex.Matches(HtmlRawContent, @"<meta property=""og:title"" content=""[^""]+""");
           if (matches.Count > 0)
               return matches[0].ToString().Replace("<meta property=\"og:title\" content=\"", "").Replace("\"", "");
           return "";
       }

       private string FetchDuration()
       {
            MatchCollection matches = Regex.Matches(HtmlRawContent, @"<meta property=""og:video:duration"" content=""[^""]+""");
            if (matches.Count > 0)
                return matches[0].ToString().Replace("<meta property=\"og:video:duration\" content=\"", "").Replace("\"", "");
            return "";
        }
    }
}
