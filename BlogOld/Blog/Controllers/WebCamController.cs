using Blog.Helper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;

namespace Blog.Controllers
{
    public class WebCamController : Controller
    {
        // GET: WebCam
        private static Dictionary<string,int> _records= new Dictionary<string, int>();
        //private ActionResult WebCamView()
        //{
        //    return Content(GetHtmlRawContent());
        //}

        public ActionResult WebCamView()
        {
            if (Session["allowViewCam"] != null && Session["allowViewCam"].Equals("true"))
            {
                ViewBag.ipAddress = DatacacheHelper.GetInstance().GetIpAddress();
                return View();
            }
             return RedirectToAction("Index","WebCam");
        }
        public ActionResult SignOut()
        {
            Session["allowViewCam"] = null;
            return Content("<script>window.location='Index'</script> ");
        }

        [HttpPost]
        public ActionResult SignIn(string inputUserName, string inputPassword)
        {
            string ip = Request.UserHostAddress ?? "0.0.0.0";
            if (inputUserName.ToLower().Equals("reset") && inputPassword.ToLower().Equals("pleasereset"))
            {
                _records = new Dictionary<string, int>();
                return Content("Successfully reset the records");
            }
            if (_records.ContainsKey(ip) && _records[ip] >= 3)
            {
                return Content("Maximum failed trys, please contact with <a href='mailto:axieyangb@gmail.com?Subject=ResetTimes' >admin</a>");
            }

            if (inputUserName.ToLower().Equals("root") && inputPassword.ToLower().Equals("a6163484a"))
            {
                Session["allowViewCam"] = "true";
                if (_records.ContainsKey(ip))
                {
                    _records[ip] = 1;
                }
                return RedirectToAction("WebCamView", "WebCam");
            }
            if (_records.ContainsKey(ip))
            {
                var count = _records[ip];
                _records[ip] = ++count;
            }
            else
            {
                _records.Add(ip,1);
            }
            return Content("Not matched, please try again");
        }
        public ActionResult Index()
        {
            if (Session["allowViewCam"] != null && Session["allowViewCam"].Equals("true"))
                return WebCamView();
            return View();
        }
       

        //public void DownloadImage(string fileName)
        //{
        //    if (string.IsNullOrEmpty(fileName)) return;
        //    string ipAddress = GetIpAddress();
        //    string fileUrl = "http://" + ipAddress + ":5000/WebcamController/CapturedImgs/" + fileName + ".jpg";
        //    try
        //    {
        //        Response.Clear();
        //        using (var wc = new WebClient())
        //        using (var stream = wc.OpenRead(fileUrl))
        //        {
        //            stream?.CopyTo(Response.OutputStream);
        //        }
        //        Response.ContentType = "application/octet-stream";
        //        Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName + ".jpg");
        //        Response.End();
        //    }
        //    catch (Exception e)
        //    {
        //    }
        //}
        public void SendRequest(string action)
        {
            //string url = GetIpAddress()+":5000/WebController";
            string url = "http://"+ DatacacheHelper.GetInstance().GetIpAddress()+ ":5000/WebcamController";
            MyWebRequest httpWebRequest =new MyWebRequest(url,"POST","action="+action);
            httpWebRequest.GetResponse();
        }
    }
}