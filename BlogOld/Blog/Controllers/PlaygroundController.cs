using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Blog.Models;
using Newtonsoft.Json;
using NSoup.Nodes;
using NSoup.Select;

namespace Blog.Controllers
{
    public class PlaygroundController : Controller
    {
        //
        // GET: /Users/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult TextbasedMazeGame()
        {
            return View();
        }

        public ActionResult RollABall()
        {
            return View();
        }
        public ActionResult SpaceShooter()
        {
            return View();
        }
        public ActionResult SurvivalShooter()
        {
            return View();
        }

        public ActionResult CaseTracker()
        {
            return View();
        }

        public string GetStatus(string caseNumber)
        {
          
            string url = "https://egov.uscis.gov/casestatus/mycasestatus.do?appReceiptNum=" + caseNumber;
            Document doc = NSoup.NSoupClient.Connect(url).Get();
            Elements elements = doc.GetElementsByTag("h1");
            return elements.Text;
        }


        public ActionResult SyncUpRecoder()
        {
            return View();
        }

        public String GetTripRecord(DateTime startDate, DateTime endDate)
        {
            using (var db = new BlogContext())
            {
              var records= db.TripRecords.Where(a => a.StartTime >= startDate && a.EndTime <= endDate).ToList();
                return JsonConvert.SerializeObject(records);
            }
        }
    }
}
