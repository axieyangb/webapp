using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebCrawler.RegexUrlHandlers;

namespace WebCrawlerTests.RegexUrlHandlers
{
    [TestClass]
    public class DatoHandlerTests
    {
        [TestMethod]
        public void TestMethod1()
        {
        }

        [TestMethod()]
        public void GetHtmlUrlListTest()
        {
            var url = "http://dato.porn/un60iq3hjnuk";
            DatoHandler oneHandler = new DatoHandler(url);
            var ret = oneHandler.GetHtmlUrlList();
        }

        [TestMethod()]
        public void GetTargetUrlListTest()
        {
            var url = "http://dato.porn/un60iq3hjnuk";
            DatoHandler oneHandler = new DatoHandler(url);
            var ret = oneHandler.GetTargetUrlList();
        }
    }
}
