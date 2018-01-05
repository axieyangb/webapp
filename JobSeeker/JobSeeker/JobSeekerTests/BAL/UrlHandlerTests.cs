using System;
using JobSeeker.BAL;
using JobSeeker.BAL.UrlHandlerPatterns;
using JobSeeker.DBModel;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace JobSeekerTests.BAL
{
    [TestClass()]
    public class UrlHandlerTests
    {
        [TestMethod()]
        public void HtmlFetchTestMonster()
        {
            var url = "https://www.monster.com/jobs/search/?q=mvc&where=dallas";

            try
            {
                UrlHandler<JobContext.Job> oneHandler = new MonsterRegexHandler(url);
                var content = oneHandler.GetRawContent();
                var urlList = oneHandler.GetTargetUrlList();
                var followingPage = oneHandler.GetHtmlUrlList();
                Assert.IsNotNull(content);
                Assert.IsNotNull(urlList);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Assert.Fail();
            }
        }
        [TestMethod()]
        public void HtmlFetchTestIndeed()
        {
            var url = "http://www.indeed.com/jobs?q=c%23+.net&l=Dallas%20TX";

            try
            {
                UrlHandler<JobContext.Job> oneHandler = new IndeedRegexHandler(url);
                var content = oneHandler.GetRawContent();
                var urlList = oneHandler.GetTargetUrlList();
                var followingPage = oneHandler.GetHtmlUrlList();
                Assert.IsNotNull(content);
                Assert.IsNotNull(urlList);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Assert.Fail();
            }
        }
    }
}