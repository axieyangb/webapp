using Microsoft.VisualStudio.TestTools.UnitTesting;
using JobSeeker.BAL.UrlHandlerPatterns;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobSeeker.BAL.UrlHandlerPatterns.Tests
{
    [TestClass()]
    public class IndeedRegexHandlerTests
    {
        [TestMethod()]
        public void GetHtmlUrlListTest()
        {
            var url = "http://www.indeed.com/jobs?q=c%23+.net&l=Dallas%20TX";
            var urlHandler =  new IndeedRegexHandler(url);
           var ret=urlHandler.GetHtmlUrlList();
            var targets = urlHandler.GetTargetUrlList();
        }
    }
}