using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using JobSeeker.DBModel;

namespace JobSeeker.BAL.UrlHandlerPatterns
{
   public class MonsterRegexHandler:UrlHandler<JobContext.Job>
    {
       public MonsterRegexHandler(string rawHtmlData) : base(rawHtmlData)
       {
       }

       public override List<string> GetHtmlUrlList()
       {
            HashSet<string> ret = new HashSet<string>();
            MatchCollection matches = Regex.Matches(HtmlRawContent, @"\?q=[a-zA-Z=;&0-9]+page=[0-9]{0,2}");
            foreach (var oneMatch in matches)
            {
                var str = oneMatch.ToString();
                var index = str.IndexOf("page=", StringComparison.Ordinal);
                var substring = str.Substring(0, index + 5);
                for (int i = 0; i < 10; i++)
                {
                    var url = "https://www.monster.com/jobs/search/" + substring + (i + 1);
                    ret.Add(url.Replace("amp;", ""));
                }
               
            }
            return ret.ToList();
        }

       public override List<string> GetTargetUrlList()
       {
            HashSet<string> ret = new HashSet<string>();
            MatchCollection matches = Regex.Matches(HtmlRawContent, @"(http(s){0,1}:\/\/jobview.monster.com(.)+\?jobPosition=[0-9]+)|(http(s){0,1}:\/\/job-openings.monster.com\/monster\/(.)+jobPosition=[0-9]+)");
            foreach (var oneMatch in matches)
            {
                ret.Add(oneMatch.ToString().Replace("amp;",""));
            }
            return ret.ToList();
        }

       public override JobContext.Job Get()
       {
            MatchCollection matches = Regex.Matches(HtmlRawContent,
                 @"([^\\<>]+<\/p>)|([^\\<>]+<\/span>)|([^\\<>]+<\/strong>)|([^\\<>]+<\/li>)");
            var oneJob = new JobContext.Job();
            foreach (var oneMatch in matches)
            {


                var details = oneMatch.ToString().Replace("</span>", "").Replace("</li>", "").Replace("</p>", "").Replace("</strong>", "");
                details = Regex.Replace(details, @"&[#a-zA-Z0-9]+;", "");
                if (!string.IsNullOrEmpty(details))
                    oneJob.JobDescription += "|" + details;
            }
           oneJob.URL = RootUrl;
            return oneJob;
        }
    }
}
