using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebCrawler.RegexUrlHandlers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebCrawler.DatabaseModel;

namespace WebCrawler.RegexUrlHandlers.Tests
{
    [TestClass()]
    public class QingyuHandlerTests
    {
        [TestMethod()]
        public void GetHtmlUrlListTest()
        {
            var url = "view-source:http://www.qyle9.com/566/%E5%9B%BD%E4%BA%A7%E7%B3%BB%E5%88%97-%E5%90%8C%E5%AD%A6%E4%BC%9A%E5%90%8C%E5%AD%A6%E5%B0%B1%E6%98%AF%E6%90%9E%E7%A0%B4%E9%9E%8B/";
            UrlHandler oneHandler=new QingyuHandler(url);
          List<string> ret=oneHandler.GetHtmlUrlList();
            List<Source> sources = oneHandler.GetTargetUrlList();
        }
    }
}