using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebCrawler.RegexUrlHandlers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebCrawler.RegexUrlHandlers.Tests
{
    [TestClass()]
    public class AotuHandlerTests
    {
        [TestMethod()]
        public void GetHtmlUrlListTest()
        {
            var url = "http://www.aotu9.com/dsp/popular/";
            UrlHandler oneHandler = new AotuHandler(url);
            var ret = oneHandler.GetHtmlUrlList();
        }

        [TestMethod()]
        public void GetTargetUrlListTest()
        {
            var url = "http://www.aotu9.com/700/%E5%87%B9%E5%87%B8%E9%97%A8%E4%BA%8B%E4%BB%B6-%E6%9F%90%E7%94%B5%E8%A7%86%E5%89%A7%E5%AF%BC%E6%BC%94%E6%BD%9C%E8%A7%84%E5%88%99%E6%9E%81%E5%93%81%E4%B8%AD%E6%88%8F%E6%A0%A1%E8%8A%B1-%E5%9B%BD%E8%AF%AD%E5%AF%B9%E7%99%BD/";
            UrlHandler oneHandler = new AotuHandler(url);
            var ret = oneHandler.GetTargetUrlList();
        }
    }
}