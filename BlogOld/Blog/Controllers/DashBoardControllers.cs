using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Blog.Models;
using System.Data.Entity;
using System.Dynamic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using Blog.Helper;
using Blog.Models.ViewModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Simple.ImageResizer;
namespace Blog.Controllers
{
    public class DashBoardController : Controller
    {
        //
        // GET: /DashBoard/
       // private readonly BlogContext _db;

        public DashBoardController()
        {
            //_db = new BlogContext(ConfigurationManager.ConnectionStrings["BlogContext"].ConnectionString);
        }

        public DashBoardController(BlogContext db)
        {
           // _db = db;
        }
        public ActionResult Index()
        {
            if (Session["LoggedUserID"] == null)
                return RedirectToAction("Login", "Admin");
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            using (var db = new BlogContext())
            {
                ViewBag.totalArticles = db.Articles.Count(a => a.AuthorId == userId);
                ViewBag.totalUploadPictures = db.Images.Count(a => a.UserId == userId && a.DeleteTime == null);
                ViewBag.totalSavedCodes = db.SouceCode.Count( a=>a.CreateUser == userId && a.Active == 1);
                ViewBag.totalComments = db.ArticleComments.Count(a => a.CommenterId == userId && a.IsValid == 1);
            }
           
            return View();
        }


        public async Task<string> GetComments()
        {
            if (Session["LoggedUserID"] == null)
                return "Session Expired";
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            using (var db = new BlogContext())
            {
                var comments =await (from a in db.CommentDetailInfo
                    join b in db.Articles on a.ArticleId equals b.ArticleId
                    where b.AuthorId == userId && b.IsRemoved == 0
                    select a).ToListAsync();
                return JsonConvert.SerializeObject(comments);
            }
            
        }


        public async Task<string> GetArticles()
        {
            if (Session["LoggedUserID"] == null)
                return "Session Expired";
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            using (var db = new BlogContext())
            {
                var articles =await (from a in db.Articles
                    where a.IsRemoved == 0 && a.AuthorId == userId
                    select new 
                    {
                        ArticleId= a.ArticleId,
                        Title= a.Title,
                        PostDate=a.PostDate,
                        ModifyDate= a.ModifyDate
                    }).ToListAsync();
                return JsonConvert.SerializeObject(articles);
            }
        }
         //public ActionResult _CommentTable_Index()
        //{
        //    if (Session["LoggedUserID"] == null)
        //        return Content("Session Expired");
        //    long userId = int.Parse(Session["LoggedUserID"].ToString());
        //    var comments = (from a in _db.CommentDetailInfo
        //                    join b in _db.Articles on a.ArticleId equals b.ArticleId
        //                    where b.AuthorId == userId && b.IsRemoved == 0
        //                    select a);

        //    ViewBag.Comments = comments;
        //    return PartialView();
        //}

        public async Task<string> GetCodes()
        {
            if (Session["LoggedUserID"] == null)
                return "Session Expired";
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            using (var db = new BlogContext())
            {
                var codes = await (from a in db.SouceCode where 
                                      a.Active==1 && a.CreateUser == userId
                    select new DashboardCodeViewModel
                    {
                        CodeID= a.CodeID,
                        CodeLanguage= a.CodeLanguage,
                        CodeTitle= a.CodeTitle,
                        CodeGuid= a.CodeGuid,
                        Shared=a.Shared,
                        LastEditDate = a.LastEditDate
                    }).ToListAsync();
                foreach (var code in codes)
                {
                 code.ShortGuid = new GuidHelper.ShortGuid(code.CodeGuid);
                }
                return JsonConvert.SerializeObject(codes);
            }
        }
        public ActionResult _ArticleChart_Index()
        {
            if (Session["LoggedUserID"] == null)
                return Content("Session Expired");
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            List<double>[] posteNums = new List<double>[2];
            posteNums[0] = new List<double>();
            posteNums[1] = new List<double>();
            using (var db = new BlogContext())
            {
                List<DateTime> articlePostTime = (from a in db.Articles
                    where a.IsRemoved == 0 && a.AuthorId == userId
                    select a.PostDate).ToList();
                List<DateTime> picturePostTime = (from a in db.Images
                    where a.DeleteTime != null && a.UserId == userId
                    select a.UpdateDate).ToList();
                int currentMonth = DateTime.Now.Month;
                int currentYear = DateTime.Now.Year;
                for (int i = 0; i < 6; i++)
                {
                    if (currentMonth <= 0)
                    {
                        currentMonth = 12;
                        currentYear--;
                    }
                    int countArticle = articlePostTime.Count(a => a.Year == currentYear && a.Month == currentMonth);
                    int countPicture = picturePostTime.Count(a => a.Year == currentYear && a.Month == currentMonth);
                    posteNums[0].Insert(0, countArticle);
                    posteNums[1].Insert(0, countPicture);
                    currentMonth--;
                }
            }
            return PartialView(posteNums);
        }

        public ActionResult _ArticleCommentChart_Index()
        {
            if (Session["LoggedUserID"] == null)
                return Content("Session Expired");
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            List<double> commentNums = new List<double>();
            using (var db = new BlogContext())
            {
                List<DateTime> commentDates = (from a in db.ArticleComments
                                               join ar in db.Articles on a.ArticleId equals ar.ArticleId
                                               where ar.AuthorId == userId && a.IsValid == 1 && ar.IsRemoved == 0
                                               select a.CreateDate).ToList();
                int currentMonth = DateTime.Now.Month;
                int currentYear = DateTime.Now.Year;
                for (int i = 0; i < 6; i++)
                {
                    if (currentMonth <= 0)
                    {
                        currentMonth = 12;
                        currentYear--;
                    }
                    int countComments = commentDates.Count(a => a.Year == currentYear && a.Month == currentMonth);
                    commentNums.Insert(0, countComments);
                    currentMonth--;
                }
            }
           
            return PartialView(commentNums);
        }
        //public ActionResult _ArticleTable_Index()
        //{
        //    if (Session["LoggedUserID"] == null)
        //        return Content("Session Expired");
        //    long userId = int.Parse(Session["LoggedUserID"].ToString());
        //    using (var db = new BlogContext())
        //    {
        //        List<Article> articles = (from a in db.Articles
        //            where a.IsRemoved == 0 && a.AuthorId == userId
        //            select a).ToList();
        //        return PartialView(articles);
        //    }
            
        //}

        [HttpPost]
        public bool CommentDelete(int? commentId)
        {
            if (commentId == null) return false;

            try
            {
                using (var db = new BlogContext())
                {
                    var oneComent = db.ArticleComments.First(a => a.CommentId == commentId);
                    oneComent.IsValid = 0;
                    db.SaveChanges();
                }              
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        [HttpPost]
        public bool ArticleDelete(int? articleId)
        {
            if (articleId == null) return false;
            try
            {
                using (var db = new BlogContext())
                {
                    var oneArticle = db.Articles.First(a => a.ArticleId == articleId);
                    oneArticle.IsRemoved = 1;
                    db.SaveChanges();
                    return true;
                }
               
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<ActionResult> Post()
        {
            if (Session["LoggedUserID"] != null)
            {
                long userId = int.Parse(Session["LoggedUserID"].ToString());
                using (var db = new BlogContext())
                {
                    var popTags = await db.Tags.Where(a => a.IsDeleted == 0).ToListAsync();
                    foreach (var popTag in popTags)
                    {
                        popTag.TagCount =
                            db.Articles.Count(a => (a.TagId1 == popTag.TagId || a.TagId2 == popTag.TagId ||
                                                    a.TagId3 == popTag.TagId || a.TagId4 == popTag.TagId ||
                                                    a.TagId5 == popTag.TagId) && a.IsRemoved == 0);
                    }
                    ViewBag.popularTags = (from a in popTags
                        orderby a.TagContent
                        select new
                        {
                            a.TagContent,
                            a.TagCount
                        }
                    ).ToList();

                    var recentlyUsedTagsQuery = (from a in db.Articles
                        where a.TagId1 != null && a.AuthorId == userId
                        join t in db.Tags on a.TagId1 equals t.TagId
                        select new
                        {
                            TagId = a.TagId1,
                             t.TagContent
                        }
                        into aT
                        group aT by new {aT.TagId,aT.TagContent}
                        into grouping
                        orderby grouping.Count()  descending select grouping.Key
                        );
                    ViewBag.recentlyUsedTags = recentlyUsedTagsQuery.Take(5).ToList();
                    return View();
                }
            }
            return RedirectToAction("Login", "Admin");
        }

        public ActionResult Upload()
        {
            if (Session["LoggedUserID"] != null)
                return View();
            return RedirectToAction("Login", "Admin");
        }
        [HttpGet]
        public async Task<ActionResult> ViewImage(int? id)
        {
            if (Session["LoggedUserID"] == null)
            {
                return Content("Sorry ! please login first <a href='/Admin/Login'>Click Here to Login</a>");
            }
            if (id == null)
                id = int.Parse(Session["LoggedUserID"].ToString());
            using (var db = new BlogContext())
            {
                var images = await db.Images.Where(a => a.UserId == id && a.IsBlock == 0 && a.DeleteTime == null)
                    .OrderByDescending(a => a.UpdateDate).ToListAsync();
                return View(images);
            }
        }


        [HttpPost]
        // ReSharper disable once InconsistentNaming
        public async Task<PartialViewResult> PicOperation(string ImageID, string operation)
        {
            if (Session["LoggedUserID"] == null)
                return  new PartialViewResult();
            var id = long.Parse(Session["LoggedUserID"].ToString());
            var imageId = long.Parse(ImageID);
            using (var db = new BlogContext())
            {
                var one = await (from image in db.Images
                    where image.ImageId == imageId && image.UserId == id
                    select image).FirstAsync();
                try
                {
                    switch (operation)
                    {
                        case "PublicPicture":
                            one.IsPublish = 1;
                           await db.SaveChangesAsync();
                            break;
                        case "PrivatePicture":
                            one.IsPublish = 0;
                            await db.SaveChangesAsync();
                            break;
                        case "DeletePicture":
                            var archivePath = Server.MapPath("/Content/Users/" + id + "/DelArchive");
                            if (!Directory.Exists(archivePath))
                            {
                                Directory.CreateDirectory(archivePath);
                            }
                            var splits = one.Url.Split('/');
                            if (System.IO.File.Exists(Server.MapPath(one.Url)))
                            {
                                System.IO.File.Move(Server.MapPath(one.Url),
                                    Path.Combine(archivePath, splits[splits.Length - 1]));
                            }
                            one.DeleteTime = DateTime.Now;
                            await db.SaveChangesAsync();
                            one = null;
                            break;
                        default:
                            break;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }
                return PartialView("_OneImage", one);
            }
        }

        [HttpGet]
        public async Task<string> GetDescription(string pictureIdStr)
        {
            long id;
            if (!long.TryParse(pictureIdStr, out id)) return "";
            using (var db = new BlogContext()) {
                var ret =await db.PublicImages.FirstOrDefaultAsync(a => a.PictureId == id);
            if (ret != null)
                return ret.Description;
            }
            return "";
        }
    



        [HttpPost]
        public async Task<string> WriteDescription(string pictureIdStr, string content)
        {
            long pictureId;
            if (!long.TryParse(pictureIdStr, out pictureId)) return "Picture id is not valid";
            if (string.IsNullOrEmpty(content)) return "Content should not be empty";
            using (var db = new BlogContext())
            {
                var publicImage =await db.PublicImages.FirstOrDefaultAsync(a => a.PictureId == pictureId);
                if (publicImage == null) return "Image should be public before adding description";
                publicImage.Description = content;
                await db.SaveChangesAsync();
                return "Successufully editing the description";
            }
        }

        [HttpPost]
        public async Task<JsonResult> FileUpload()
        {
            var retList = new LinkedList<RetJsonModel>();
            for (var i = 0; i < Request.Files.Count; i++)
            {
                var file = Request.Files[i];
                if (file == null) continue;
                var ret = new RetJsonModel
                {
                    ContentType = file.ContentType,
                    UserId = Session["LoggedUserID"].ToString()
                };
                if (ret.ContentType.Contains("image/"))
                {
                    ret.IsAccept = 0;
                    ret.FileTypeAccept = "yes";
                    ret.FileName = DateTime.Now.ToString("yyyyMMddHHmmss") + '_' + i + '_' + file.FileName;
                    if (!string.IsNullOrEmpty(ret.UserId))
                    {

                        if (!Directory.Exists(Server.MapPath("~/Content/Users/" + ret.UserId)))
                        {
                            Directory.CreateDirectory(Server.MapPath("~/Content/Users/" + ret.UserId));
                        }
                        ret.Url = "/Content/Users/" + ret.UserId + "/" + ret.FileName;
                        var path = Path.Combine(Server.MapPath("~/Content/Users/" + ret.UserId + ""), ret.FileName);
                        var stream = file.InputStream;
                        using (var fileStream = System.IO.File.Create(path))
                        {
                            stream.CopyTo(fileStream);
                        }
                        var resizer = new ImageResizer(@path);
                        var thumbtailPath = Path.Combine(Server.MapPath("~/Content/Users/" + ret.UserId + "/thumbtail/"), ret.FileName);
                        resizer.Resize(400, 400, ImageEncoding.Jpg90);
                        if (!Directory.Exists(Server.MapPath("~/Content/Users/" + ret.UserId + "/thumbtail/")))
                            Directory.CreateDirectory(Server.MapPath("~/Content/Users/" + ret.UserId + "/thumbtail/"));
                        resizer.SaveToFile(@thumbtailPath);
                        var image = new ImageViewModel();
                        var imageMetaDate = new ImageMetaData(Server.MapPath(ret.Url));
                        image.FileName = ret.FileName;
                        image.UpdateDate = DateTime.Now;
                        image.UserId = long.Parse(ret.UserId);
                        image.Url = ret.Url;
                        image.ContentType = file.ContentType;
                        using (var db = new BlogContext())
                        {
                            db.Images.Add(image);
                            imageMetaDate.FetchData();
                            var metadata = imageMetaDate.GetMetaData();
                            db.ImageMetaData.Add(metadata);
                            await db.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        ret.IsAccept = 1;
                        ret.Error = "Member Session Expired";
                    }

                }
                else
                {
                    ret.IsAccept = 1;
                    ret.FileName = file.FileName;
                    ret.Error = "Content Type Deny";
                }
                retList.AddLast(ret);
            }
            var javaScriptSerializer = new JavaScriptSerializer();
            var jsonString = javaScriptSerializer.Serialize(retList);
            return Json(jsonString);
        }

        [HttpPost]
        public async Task<ActionResult> UploadImage(int id, HttpPostedFileWrapper upload)
        {
            string ret;
            if (upload != null)
            {
                if (upload.ContentLength <= 1024 * 1024 * 5)
                {
                    var imageName = DateTime.Now.ToString("yyyyMMddHHmmss") + '_' + upload.FileName;
                    if (!System.IO.Directory.Exists(Server.MapPath("/Content/Users/" + id)))
                    {
                        System.IO.Directory.CreateDirectory(Server.MapPath("/Content/users/" + id));
                    }
                    var path = System.IO.Path.Combine(Server.MapPath("/Content/users/" + id), imageName);
                    var url = "/Content/users/" + id + "/" + imageName;
                    upload.SaveAs(path);
                    var resizer = new ImageResizer(@path);
                    var thumbtailPath = System.IO.Path.Combine(Server.MapPath("~/Content/Users/" + id + "/thumbtail/"), upload.FileName);
                    resizer.Resize(400, 400, ImageEncoding.Jpg90);
                    if (!System.IO.Directory.Exists(Server.MapPath("~/Content/Users/" + id + "/thumbtail/")))
                        System.IO.Directory.CreateDirectory(Server.MapPath("~/Content/Users/" + id + "/thumbtail/"));
                    resizer.SaveToFile(@thumbtailPath);
                    var image = new ImageViewModel();
                    var imageMetaDate = new ImageMetaData(Server.MapPath(image.Url));
                    imageMetaDate.FetchData();
                    var metadata = imageMetaDate.GetMetaData();
                    image.ContentType = upload.ContentType;
                    image.UpdateDate = DateTime.Now;
                    image.UserId = long.Parse(Session["LoggedUserID"].ToString());
                    image.Url = url;
                    image.FileName = imageName;
                    using (var db = new BlogContext())
                    {
                        db.Images.Add(image);
                        db.ImageMetaData.Add(metadata);
                        await db.SaveChangesAsync();
                    }
                    ret = url;
                }
                else
                {
                    ret = "<p style=\"color:red\">image exceed the maximum 5MB</p>";
                }
            }
            else
            {
                ret = "<p style=\"color:red\">image is empty</p>";
            }
            return Content(ret);
        }

        public class RetJsonModel
        {
            public int IsAccept { get; set; }
            public string FileTypeAccept { get; set; }
            public string FileName { get; set; }
            public string ContentType { get; set; }
            public string Url { get; set; }
            public string UserId { get; set; }
            public string Error { get; set; }
        }
        public async Task<ActionResult> EditProfile()
        {
            if (Session["LoggedUserID"] == null)
                return RedirectToAction("Login", "Admin");
           
            using (var db = new BlogContext())
            {
                long userId = long.Parse(Session["LoggedUserID"].ToString());
                Member cur = await db.Members.FirstOrDefaultAsync(a=>a.UserID==userId);
                cur.Profile = await db.Profile.FirstOrDefaultAsync(a => a.UserID == userId);
                return View(cur);

            }
          
        }

        public async Task<bool> SaveProfile(Profile profile)
        {
            if (Session["LoggedUserID"] == null)
                return false;
            long userId = long.Parse(Session["LoggedUserID"].ToString());
            using (var db = new BlogContext())
            {
                var profileInDb = await db.Profile.FirstOrDefaultAsync(a => a.UserID.Equals(userId));
                if (profileInDb == null) return false;
                profileInDb.Description = profile.Description;
                profileInDb.Email = profile.Email;
                profileInDb.NickName = profile.NickName;
                profileInDb.Title = profile.Title;
                profileInDb.LastUpdateDate = profile.LastUpdateDate ?? DateTime.Now;
                if (!string.IsNullOrEmpty(profile.ProfileImageName))
                    profileInDb.ProfileImageName = profile.ProfileImageName;
                profileInDb.School = profile.School;
                profileInDb.Website = profile.Website;
                profileInDb.Address = profile.Address;
                profileInDb.BirthDate = profile.BirthDate;
                await db.SaveChangesAsync();
            }
            return true;
        }

        public ActionResult SignOut()
        {
            Session["LoggedUserID"] = null;
            return RedirectToAction("Index", "Home");
        }


        [HttpPost]
        public async Task<string> ProfileImageUpload()
        {
            if (Session["LoggedUserID"] == null)
                return null;

            var file = Request.Files[0];
            if (file == null) return null;
            if (file.ContentType.Contains("image/"))
            {
                var profileDrectory = new DirectoryInfo(Path.Combine(Server.MapPath("~/Content/Users/" + Session["LoggedUserID"] + "/profile")));
                if (!profileDrectory.Exists)
                {
                    profileDrectory.Create();
                }
                string fileName = DateTime.Now.ToString("yyyyMMddHHmmss") + "_profile.jpg";
                var path = Path.Combine(profileDrectory.FullName, fileName);
                var stream = file.InputStream;
                using (var fileStream = System.IO.File.Create(path))
                {
                    await stream.CopyToAsync(fileStream);
                }
                var resizer = new ImageResizer(@path);
                resizer.Resize(100, 100, ImageEncoding.Jpg90);
                resizer.SaveToFile(path);
                using (var db = new BlogContext())
                {
                    Profile profile = await db.Profile.FindAsync(long.Parse(Session["LoggedUserID"].ToString()));
                    if (profile != null) profile.ProfileImageName = fileName;
                    await db.SaveChangesAsync();
                }
                return "/Content/users/" + Session["LoggedUserID"] + "/profile/" + fileName;
            }
            return null;
        }

        public async Task<string> SearchMemberByName(string userName)
        {
            using (var db = new BlogContext())
            {
                string lowerKeyword = userName.ToLower();
                var ret = await (from m in db.Members
                    join p in db.Profile on m.UserID equals p.UserID
                    where m.isActive == 1 && (m.UserName.ToLower().Contains(lowerKeyword) ||
                                              !string.IsNullOrEmpty(p.NickName) && p.NickName.Contains(userName))
                    select new UserIno
                    {
                        UserId = m.UserID,
                        UserName = m.UserName,
                        NickName = p.NickName
                    }
                ).ToListAsync();

                return JsonConvert.SerializeObject(ret);
            }
        }

        public class UserIno
        {
            public long? UserId { get; set; }
            public string UserName { get; set; }
            public string NickName { get; set; }
        }
    }


}
