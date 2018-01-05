using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using JobSeeker.DBModel;

namespace JobSeeker.BAL
{
    public static class Extensions
    {
        public static HashSet<T> ToHashSet<T>(this IEnumerable<T> source)
        {
            return new HashSet<T>(source);
        }
    }
   public class UrlStorage
   {
       private readonly HashSet<string> _urlFurtherLinks;
       private readonly LinkedList<string> _unVisitedUrls;
       private readonly LinkedList<string> _targetUrls;
       private readonly HashSet<string> _historyUrls;
       private readonly int _upboundNum;
       private readonly Types.WebsiteType _type;
       private readonly string _websiteName;
        public UrlStorage(LinkedList<string> entries, Types.WebsiteType type)
       {
             _unVisitedUrls = entries;
            _urlFurtherLinks=new HashSet<string>();
            _targetUrls = new LinkedList<string>();
            _type = type;
            switch (_type)
            {
                case Types.WebsiteType.Monster:
                    _websiteName = "Monster";
                    break;
                case Types.WebsiteType.Indeed:
                    _websiteName = "Indeed";
                    break;
                case Types.WebsiteType.Dice:
                    _websiteName = "Dice";
                    break;
            }
            _historyUrls = HistoryJobLinks();
            _upboundNum = 10000;
        }

   
         public HashSet<string> HistoryJobLinks()
        {
 
            using (var data = new JobContext())
            {
               return (from a in data.Jobs where a.WebsiteName == _websiteName select a.URL.Length<=186 ? a.URL :a.URL.Substring(0, 186)).ToHashSet();
            }
        } 

       //private HashSet<string> GetAllvisitedUrl()
       //{
       //     var currentPath = Directory.GetCurrentDirectory();
       //     var filePath = Path.Combine(currentPath, "visitedUrls.txt");
       //     HashSet<string> entryUrls =new HashSet<string>();
       //     using (var st = new StreamReader(filePath))
       //     {
       //         while (!st.EndOfStream)
       //         {
       //             entryUrls.Add(st.ReadLine());
       //         }
       //     }
       //     return entryUrls;
       // }

       public void AppendToFile(string url)
       {
            FileInfo oneFile = new FileInfo(Path.Combine(Directory.GetCurrentDirectory(), "Files/visitedUrls.txt"));
           using (var st = oneFile.AppendText())
           {
               st.WriteLine(DateTime.Now+"\t"+url);
           }
        }
       public void AddToUnVisted(string url)
       {
            if(IsFull()) return;
            if (_urlFurtherLinks.Contains(url)) return;
           _unVisitedUrls.AddLast(url);
            _urlFurtherLinks.Add(url);
       }

       public bool IsEmpty()
       {
           return _unVisitedUrls.Count == 0;
       }

       public bool IsFull()
       {
            if(_unVisitedUrls.Count%100==0)
                Console.WriteLine(_unVisitedUrls.Count +"new websites found |"+ _targetUrls.Count+" new job url found");
           return _unVisitedUrls.Count >= _upboundNum;
       }
        public string GetUrl()
        {
            string ret = _unVisitedUrls.First.Value;
            _unVisitedUrls.RemoveFirst();
            return ret;
        }

       public void AddToTargetUrl(string url)
       {
           var test = url.Length <= 186 ? url: url.Substring(0, 186);
            if (_historyUrls.Contains(test)) return;
            Console.WriteLine(url);
            _targetUrls.AddLast(url);
           _historyUrls.Add(test);
       }

       public LinkedList<string> GetTargetUrl()
       {
           return _targetUrls;
       }
    }
}
