using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using FileDownloader.DatabaseModel;

namespace FileDownloader
{
    class Program
    {
        static void Main(string[] args)
        {
            do
            {
                try
                {
                    var oneSource = GetFirstUnvisitedUrl();
                    string path = System.Configuration.ConfigurationManager.AppSettings["path"];
                    if (oneSource == null) break;
                    WebClient wb = new WebClient();
                    wb.Headers.Remove("User-Agent");
                    wb.Headers.Add("User-Agent",
                        "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.33 Safari/537.36");
                    wb.DownloadFile(oneSource.SourceUrl, Path.Combine(path, oneSource.Title + ".mp4"));
                    Console.WriteLine(oneSource.SourceUrl +" has been downloaded successfully" );
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            } while (true);
        }

        public static Source GetFirstUnvisitedUrl()
        {
            using (var data = new WebCrawlerContext())
            {
                //If you want to download the mobile version videos , please using
                // var site = data.Sources.OrderBy(a=>a.Title).FirstOrDefault(a => a.IsVisited == 0 && a.SourceTypeName == "mobile" );
                var site = data.Sources.OrderBy(a=>a.Title).FirstOrDefault(a => a.IsVisited == 0 && a.SourceTypeName == "mp4" );

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
