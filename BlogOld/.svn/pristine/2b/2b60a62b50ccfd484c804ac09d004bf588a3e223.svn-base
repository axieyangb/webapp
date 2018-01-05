using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using Blog.Models;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Blog.Helper;
using Ionic.Zip;

namespace Blog.Controllers
{
    public class GalleryController : Controller
    {
        //
        // GET: /Gallery/
        private readonly BlogContext _db;

        public GalleryController()
        {
            _db = new BlogContext(ConfigurationManager.ConnectionStrings["BlogContext"].ConnectionString);
        }

        public GalleryController(BlogContext db)
        {
            _db = db;
        }

        //  [OutputCache(CacheProfile = "CacheFor300Seconds",VaryByHeader = "X-Requested-With")]
        public ActionResult Index()
        {

            return View();
        }

        public string GetImgList()
        {
            var publicImg = from x in _db.PublicImagesVw
                orderby x.PublicId descending
                select x;
            List<PublicImageViewModel> ret = publicImg.ToList();
            return JsonConvert.SerializeObject(ret);
        }

        public int ThumbUp(long? pictureId)
        {
            if (pictureId == null) return -1;
            long userId = 0;
            string address = Request.ServerVariables["REMOTE_ADDR"];
            if (Session["LoggedUserID"] != null)
            {
                long.TryParse(Session["LoggedUserID"].ToString(), out userId);
            }
            var history =
                _db.FeedbackHistory.FirstOrDefault(
                    a => a.ImageId == pictureId && a.FeedbackType == 0 && a.IpAddress == address);
            if (history != null) return -1;
            var newHistory = new FeedbackHistory
            {
                ImageId = pictureId,
                FeedbackType = 0,
                CreateTime = DateTime.Now,
                IpAddress = address,
                UserId = userId == 0 ? (long?) null : userId
            };
            _db.FeedbackHistory.Add(newHistory);
            var publicImage = _db.PublicImages.FirstOrDefault(a => a.PictureId == pictureId);
            if (publicImage == null) return -1;
            publicImage.Like++;
            _db.SaveChanges();
            return publicImage.Like;
        }

        public async Task<double> Rate(long? pictureId, string rate, string token)
        {
            if (string.IsNullOrEmpty(token)) return -2;
            ValidationHelper helper = new ValidationHelper();
            bool isValid = await helper.GetResponse(token);
            if (!isValid) return -2;
            if (pictureId == null || string.IsNullOrEmpty(rate)) return -1;
            double rateDouble;
            if (!double.TryParse(rate, out rateDouble) || rateDouble < 0 || rateDouble > 5) return -1;
            long userId = 0;
            string address = Request.ServerVariables["REMOTE_ADDR"];
            if (Session["LoggedUserID"] != null)
            {
                long.TryParse(Session["LoggedUserID"].ToString(), out userId);
            }
            var history =
                _db.FeedbackHistory.FirstOrDefault(
                    a => a.ImageId == pictureId && a.FeedbackType == 1 && a.IpAddress == address);
            if (history != null) return -1;
            var newHistory = new FeedbackHistory
            {
                ImageId = pictureId,
                FeedbackType = 1,
                Content = rateDouble.ToString(CultureInfo.InvariantCulture),
                CreateTime = DateTime.Now,
                IpAddress = address,
                UserId = userId == 0 ? (long?) null : userId
            };
            _db.FeedbackHistory.Add(newHistory);
            var publicImage = _db.PublicImages.FirstOrDefault(a => a.PictureId == pictureId);
            if (publicImage == null) return -1;
            double totalRates = publicImage.Rate*publicImage.RateNum;
            totalRates += rateDouble;
            publicImage.Rate = totalRates/(++publicImage.RateNum);
            _db.SaveChanges();
            return publicImage.Rate;
        }

        public FileResult Download(string pictureStr)
        {
            string[] pictureList = pictureStr.Split(',');
            string rootPath = Server.MapPath("~");
            var phycialPaths = new List<string>();
            for (int i = 0; i < pictureList.Length; i++)
            {
                long pictureId = long.Parse(pictureList[i]);
                string url = _db.Images.FirstOrDefault(a => a.ImageId == pictureId)?.Url;
                if (string.IsNullOrEmpty(url)) continue;
                url = url.Substring(1);
                phycialPaths.Add(Path.Combine(rootPath, url).ToString());
            }
            var fileName = $"{DateTime.Now:dd_MM_yyyy_HH_mm_ss}" + ".zip";
            using (ZipFile zip = new ZipFile())
            {
                foreach (var path in phycialPaths)
                {
                    zip.AddFile(path, "/");
                }
                fileName = Path.Combine(rootPath, "Content/download_temp/" + fileName);
                zip.Save(fileName);
            }
            byte[] fileBytes = System.IO.File.ReadAllBytes(fileName);
            return File(fileBytes, "application/zip", $"{DateTime.Now:dd_MM_yyyy_HH_mm_ss}" + ".zip");
        }

        public string GetHottestPictureByDays(int days)
        {
            var ret =
                _db.FeedbackHistory.Where(a => DbFunctions.DiffDays( a.CreateTime, DateTime.Now) <= days&&a.FeedbackType==0)
                    .GroupBy(a => a.ImageId)
                    .Select(g => new {ImageId = g.Key, Count = g.Count()})
                    .OrderByDescending(x => x.Count).FirstOrDefault();
            if (ret == null) return "";
            long? imageId = ret.ImageId;
           PublicImageViewModel retModel = _db.PublicImagesVw.FirstOrDefault(a => a.PictureId == imageId);
            return JsonConvert.SerializeObject(retModel);
        }
    }
}
