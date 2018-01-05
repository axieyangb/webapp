using System.Collections.Generic;
using JobSeeker.BAL;
using JobSeeker.BAL.UrlHandlerPatterns;
using JobSeeker.DBModel;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace JobSeekerTests.BAL.UrlHandlerPatterns
{
    [TestClass()]
    public class RegexHandlerTests
    {
        [TestMethod()]
        public void GetTargetUrlListTest()
        {

            var url = "http://job-openings.monster.com/monster/02d715de-bab5-47b7-83ae-e28b7a807d70?mescoid=2900527001001&jobPosition=3";
            UrlHandler<JobContext.Job> oneHandler = new MonsterRegexHandler(url);
            var content = oneHandler.GetRawContent();
            Assert.IsNotNull(content);
            List<string> targetList = oneHandler.GetTargetUrlList();

        }
    }
}