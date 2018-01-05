using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
using Blog.Models;
using SimpleSiteMap.Service;

namespace Blog.Helper
{
    public  class SiteMapHelper
    {
        private static List<Article> GetSiteNodes()
        {
            using (var db = new BlogContext())
            {
               return db.Articles.Where(a => a.IsRemoved == 0).OrderByDescending(a=>a.PostDate).ToList();
               
            }

           
        }

        public static string GenerateXmlFile()
        {
            List<Article> articles = GetSiteNodes();
            List <SitemapNode> nodes = new List<SitemapNode>();
            string prefix = "https://"+HttpContext.Current.Request.Url.Host;
            foreach (var article in articles)
            {
                var urlEn =prefix + "/en/Article/Index/" + article.ArticleId;
                SitemapNode node = new SitemapNode(new Uri(urlEn),article.ModifyDate?? article.PostDate);
                node.Frequency = SitemapFrequency.Daily;
                node.Priority = 0.8;
                nodes.Add(node);
            }
            var sitemapService = new SitemapService();
            var xml = sitemapService.ConvertToXmlUrlset(nodes);
            return xml;
        }
    }
}