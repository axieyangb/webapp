﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using JobSeeker.DBModel;

namespace JobSeeker.BAL.UrlHandlerPatterns
{
    public class IndeedRegexHandler:UrlHandler<JobContext.Job>
    {
        public IndeedRegexHandler(string url) : base(url)
        {
        }

        public override List<string> GetHtmlUrlList()
        {
            HashSet<string> ret = new HashSet<string>();
            MatchCollection matches = Regex.Matches(HtmlRawContent, @"(\/jobs\?q\=)[^\>]+(&l\=)[^>\'\;]+(\&start)\=[0-9]{1,5}(\&pp=){0,1}\""");
            foreach (var oneMatch in matches)
            {
                var str = oneMatch.ToString().Replace("\"","");
                str= "http://www.indeed.com"+str.Replace(" ", "%20").Replace("+","%20").Replace("amp;", "").Replace("#", "%23");
                ret.Add(str);
            }
            return ret.ToList();
        }

        public override List<string> GetTargetUrlList()
        {
            HashSet<string> ret = new HashSet<string>();
            MatchCollection matches = Regex.Matches(HtmlRawContent, @"(\/pagead\/[^\""]+)|(\/rc\/clk)[^\""]+|(\/company\/)[^\""]+");
            foreach (var oneMatch in matches)
            {
                ret.Add("http://www.indeed.com"+oneMatch.ToString().Replace("amp;", "").Replace(" ", "%20").Replace("+", "%20").Replace("amp;", "").Replace("#", "%23"));
            }
            return ret.ToList();
        }

        public override JobContext.Job Get()
        {
            throw new NotImplementedException();
        }
    }
}
