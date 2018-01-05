using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using WebCrawler;
using WebCrawler.DatabaseModel;
using WebCrawler.RegexUrlHandlers;

namespace WebCrawler
{
    public class Entry
    {
        private readonly HashSet<string> _historySources;
        private readonly HashSet<string> _historyDeepSites;
        private List<DeepSite> _newFetchedSites;
        private List<Source> _newFetchedSources;
        private UrlHandler _oneUrlHandler;
        private readonly string _website;
        private readonly string _domainName;
        public Entry()
        {
             _website = System.Configuration.ConfigurationManager.AppSettings["website"];
            if (_website == "qingyu")
            {
                _domainName = "http://www.qyle9.com";
            }
            else if (_website == "aotu")
            {
                _domainName = "http://www.aotu15.com";
            }
            else if (_website == "dato")
            {
                _domainName = "http://dato.porn";
            }
            using (var data = new CrawlerContext())
            {
                _historyDeepSites = (from a in data.DeepSites where a.DomainName==_domainName select a.Url).ToHashSet();
                _historySources = (from a in data.Sources where a.SourceUrl.StartsWith(_domainName) select a.SourceUrl ).ToHashSet();
            }
        }

        public void Start()
        {
            do
            {
                try
                {
                    DeepSite site = GetFirstUnvisitedUrl();
                    if (site == null) break;
                    HandlerInit(site.DomainName + site.Url);
                    var deepUrls = _oneUrlHandler.GetHtmlUrlList();
                    _newFetchedSites = new List<DeepSite>();
                    foreach (var oneDeepUrl in deepUrls)
                    {
                        if (_historyDeepSites.Add(oneDeepUrl))
                        {
                            var oneDeepSite = new DeepSite
                            {
                                Url = oneDeepUrl,
                                IsVisited = 0,
                                Depth = site.Depth + 1,
                                DomainName = site.DomainName,
                                CreateDate = DateTime.Now
                            };
                            _newFetchedSites.Add(oneDeepSite);
                        }
                    }
                    var sourcesUrls = _oneUrlHandler.GetTargetUrlList();
                    _newFetchedSources = new List<Source>();
                    foreach (var oneSource in sourcesUrls)
                    {
                        if (_historySources.Add(oneSource.SourceUrl))
                        {
                            oneSource.SiteId = site.id;
                            oneSource.IsVisited = 0;
                            oneSource.CreateDate = DateTime.Now;
                            _newFetchedSources.Add(oneSource);
                        }
                    }
                    using (var data = new CrawlerContext())
                    {
                        data.DeepSites.AddRange(_newFetchedSites);
                        data.Sources.AddRange(_newFetchedSources);
                        data.SaveChanges();
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            } while (true);
            
        }



        private void HandlerInit(string url)
        {
            if (_website == "qingyu")
            {
                _oneUrlHandler=new QingyuHandler(url);
                return;
            }
             if (_website == "aotu")
            {
                _oneUrlHandler=new AotuHandler(url);
                return;
            }
            if (_website == "dato")
            {
                _oneUrlHandler = new DatoHandler(url);
                return;
            }
            throw new Exception("Not specify the website");
        }

        public DeepSite GetFirstUnvisitedUrl()
        {
            using (var data = new CrawlerContext())
            {
                var site =data.DeepSites.FirstOrDefault(a => a.IsVisited == 0 && a.DomainName==_domainName);
           
                if (site != null)
                {
                    site.IsVisited = 1;
                    data.SaveChanges();
                }
                return site;
            }
        }


    }
}
