using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using Blog.Models;
using System.Text.RegularExpressions;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Blog.Helper;
using Blog.Models.ViewModel;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;


namespace Blog.Controllers
{
    public class ArticleController : Controller
    {
        private List<string>[] _emojis;
        private readonly BlogContext _db;
        public ArticleController()
        {
            var emojiRootDir = new DirectoryInfo(System.Web.Hosting.HostingEnvironment.MapPath("/Content/img/emoji/"));
            var emojiPacks = emojiRootDir.GetDirectories();
            _emojis = new List<string>[emojiPacks.Length];
            for (int i = 0; i < emojiPacks.Length; i++)
            {
                if (_emojis[i] == null)
                    _emojis[i] = new List<string>();
                foreach (var fileName in emojiPacks[i].GetFiles())
                {
                    _emojis[i].Add(fileName.FullName.Replace(System.Web.HttpContext.Current.Request.PhysicalApplicationPath, string.Empty));
                }
            }
            _db = new BlogContext(ConfigurationManager.ConnectionStrings["BlogContext"].ConnectionString);
        }
        /*Test Userage*/
        public ArticleController(string connectionString)
        {
            _db = new BlogContext(connectionString);
        }
        public void SetEmojis(string rootDir)
        {
            var emojiRootDir = new DirectoryInfo(rootDir);
            var emojiPacks = emojiRootDir.GetDirectories();
            _emojis = new List<string>[emojiPacks.Length];
            for (int i = 0; i < emojiPacks.Length; i++)
            {
                if (_emojis[i] == null)
                    _emojis[i] = new List<string>();
                foreach (var fileName in emojiPacks[i].GetFiles())
                {
                    _emojis[i].Add(fileName.FullName.Replace(rootDir, string.Empty));
                }
            }
        }
        //
        // GET: /Article/

        [HttpGet]
        public ActionResult Index(long articleId = 0)
        {
            var article = _db.Articles.Find(articleId);
            if (article == null)
                return HttpNotFound();
            // article.Content = article.Content.Replace("\r\n", "<br>");

            if (article.TagId1 != null)
            { ViewBag.tag1 = _db.Tags.Find(article.TagId1)?.TagContent; ViewBag.tagId1 = article.TagId1; }
            if (article.TagId2 != null)
            { ViewBag.tag2 = _db.Tags.Find(article.TagId2)?.TagContent; ViewBag.tagId2 = article.TagId2; }
            if (article.TagId3 != null)
            { ViewBag.tag3 = _db.Tags.Find(article.TagId3)?.TagContent; ViewBag.tagId3 = article.TagId3; }
            if (article.TagId4 != null)
            { ViewBag.tag4 = _db.Tags.Find(article.TagId4)?.TagContent; ViewBag.tagId4 = article.TagId4; }
            if (article.TagId5 != null)
            { ViewBag.tag5 = _db.Tags.Find(article.TagId5)?.TagContent; ViewBag.tagId5 = article.TagId5; }
            if (articleId > 0)
            {
                ViewBag.AuthorName = (from a in _db.Members
                                      where a.UserID == article.AuthorId
                                      select string.IsNullOrEmpty(a.Profile.NickName) ? a.UserName : a.Profile.NickName).FirstOrDefault();
            }

            var comments = _db.CommentDetailInfo.Where(a => (a.ArticleId == articleId && (a.ReplyId == -1))).ToList();
            var oneArticle = new ArticleStruct
            {
                Article = article,
                RootComments = new List<CommentLevel>()
            };
            foreach (var oneComment in comments.Select(rootComment => new CommentLevel
            {
                ParentComment = rootComment,
                ChildComments =
                    _db.CommentDetailInfo.Where(
                        a => a.ArticleId == articleId && a.ReplyId == rootComment.CommentId).ToList()
            }))
            {
                oneArticle.RootComments.Add(oneComment);
            }
            /*fetch the emoji in Content\img\emoji    */
            var emojiPath = Server.MapPath("/Content/img/emoji/");
            var emojiDir = new DirectoryInfo(emojiPath);
            try
            {
                var categoryList = emojiDir.GetDirectories();
                ViewBag.emoji = new string[categoryList.Length];
                for (var i = 0; i < categoryList.Length; i++)
                    ViewBag.emoji[i] = categoryList[i].Name;
            }
            catch (Exception e)
            {
                throw new Exception(e.ToString());
            }
            return View(oneArticle);
        }



        [HttpPost]
        public JsonResult GetEmoji()
        {
            var categoaryName = Request.Form["categoaryName"];
            var emojiPack = new DirectoryInfo(Path.Combine(Server.MapPath("/Content/img/emoji/"), categoaryName));
            var oneCategory = emojiPack.GetFiles();
            var urls = new string[oneCategory.Length];
            for (var i = 0; i < oneCategory.Length; i++)
            {
                urls[i] = oneCategory[i].FullName.Replace(Request.ServerVariables["APPL_PHYSICAL_PATH"], string.Empty);
            }
            return Json(urls);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ArticlePost(ArticleSubmitView articlePost)
        {
            var article = new Article
            {
                AuthorId = articlePost.AuthorId,
                Title = HttpUtility.HtmlEncode(articlePost.Title),
                SubTitle = articlePost.SubTitle,
                Content = articlePost.Content
            };
            var tags = Request.Form["tags"];
            if (article.Content != null)
            {
                article.Content = articlePost.Content.Replace("style=\"height:", "name=\"height:");
                article.Content = HttpUtility.HtmlEncode(article.Content);
            }
            article.PostDate = DateTime.Now;
            var one = new ArticleStruct
            {
                Article = article,
                RootComments = new List<CommentLevel>()
            };

            if (ModelState.IsValid && !string.IsNullOrEmpty(article.Title))
            {
                var tagsId = GetTagId(tags);
                article.TagId1 = tagsId[0];
                article.TagId2 = tagsId[1];
                article.TagId3 = tagsId[2];
                article.TagId4 = tagsId[3];
                article.TagId5 = tagsId[4];
                _db.Articles.Add(article);
                _db.SaveChanges();
                return RedirectToAction("Index", new { articleId = article.ArticleId });
            }
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public ActionResult ArticlePreview(ArticleSubmitView articlePreview)
        {
            var article = new Article
            {
                AuthorId = articlePreview.AuthorId,
                Title = HttpUtility.HtmlEncode(articlePreview.Title),
                SubTitle = articlePreview.SubTitle,
                Content = articlePreview.Content
            };
            ViewBag.AuthorName = (from a in _db.Members
                                  where a.UserID == articlePreview.AuthorId
                                  select string.IsNullOrEmpty(a.Profile.NickName) ? a.UserName : a.Profile.NickName).FirstOrDefault();
            if (article.Content != null)
            {
                article.Content = articlePreview.Content.Replace("style=\"height:", "name=\"height:");
                article.Content = HttpUtility.HtmlEncode(article.Content);
            }
            article.PostDate = DateTime.Now;
            var one = new ArticleStruct
            {
                Article = article,
                RootComments = new List<CommentLevel>()
            };
            ViewBag.isPreView = true;
            return View("Index", one);
        }

        public long?[] GetTagId(string tags)
        {
            var splitsTags = tags.Split(',');
            var retId = new long?[5];
            for (var i = 0; i < splitsTags.Length; i++)
            {
                var tag = splitsTags[i];
                try
                {
                    var oneTag = _db.Tags.First(s =>s.IsDeleted==0 && s.TagContent.Trim().ToLower().Equals(tag.Trim().ToLower()));
                    retId[i] = oneTag.TagId;
                   // oneTag.TagCount++;
                    oneTag.LastUsedDate = DateTime.Now;
                    _db.SaveChanges();
                }
                catch (Exception)
                {
                    var oneTag = new Tags
                    {
                        TagContent = splitsTags[i].Trim().ToLower(),
                       // TagCount = 1
                    };
                    _db.Tags.Add(oneTag);
                    _db.SaveChanges();
                    retId[i] = oneTag.TagId;
                }
            }
            return retId;
        }

        [HttpPost]
        public JsonResult GetTagsList()
        {
            var tags = (from t in _db.Tags
                        select t.TagContent
                ).ToArray();
            return Json(tags);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> CommentPost(ArticleStruct articlePost)
        {
            ValidationHelper helper = new ValidationHelper();
            bool isValid = false;
            var address = Request.ServerVariables["REMOTE_ADDR"];
            if (articlePost?.Token != null && articlePost.CommentArticle != null)
            {
                isValid = await helper.GetResponse(articlePost.Token, address);
            }
            if (!string.IsNullOrEmpty(articlePost.CommentArticle.Content) && isValid)
            {


                articlePost.CommentArticle.CommentId = null;
                articlePost.CommentArticle.IsValid = 1;
                if (Session["LoggedUserID"] != null)
                    articlePost.CommentArticle.CommenterId = long.Parse(Session["LoggedUserID"].ToString());
                if (articlePost.CommentArticle.ReplyId == null)
                    articlePost.CommentArticle.ReplyId = -1;
                articlePost.CommentArticle.IpAddress = address;
                articlePost.CommentArticle.ArticleId = articlePost.Article.ArticleId;
                articlePost.CommentArticle.CreateDate = DateTime.Now;
                articlePost.CommentArticle.Content = HttpUtility.HtmlEncode(RegexEmojiReplace(articlePost.CommentArticle.Content));
                _db.ArticleComments.Add(articlePost.CommentArticle);
                _db.SaveChanges();
            }
            return RedirectToAction("Index", "Article", new { ArticleID = articlePost.Article.ArticleId });
        }



        public string RegexEmojiReplace(string content)
        {
            string pattern = "src=\"\\Content\\img\\emoji\\";
            string replacedPattern = "class=\"emojiPic\" src=\"\\Content\\img\\emoji\\";
            content = content.Replace(pattern, replacedPattern);
            return content;
        }
        [HttpPost]
        public JsonResult ArticleUpdate()
        {
            var ret = new RetJsonModel();
            var articleContent = HttpUtility.UrlDecode(Request.Form["Content"]);
            var userIdStr = Request.Form["UserID"];
            var articeIdStr = Request.Form["ArticleID"];
            try
            {
                var articleId = long.Parse(articeIdStr);
                var userId = long.Parse(userIdStr);
                var article = _db.Articles.Find(articleId);
                if (Session["LoggedUserID"].Equals(userIdStr) && article.AuthorId == userId)
                    if (Session["LoggedUserID"].Equals(userIdStr) && article.AuthorId == userId)
                    {
                        if (articleContent != null)
                            article.Content = HttpUtility.HtmlEncode(articleContent.Replace("style=\"height:", "style=\"name:"));
                        article.ModifyDate = DateTime.Now;
                        _db.SaveChanges();
                        ret.IsAccept = 1;
                        ret.UserId = article.AuthorId.ToString();
                    }
                    else
                    {
                        ret.IsAccept = 0;
                        ret.Error = "Update Failed";
                    }
            }
            catch (Exception ex)
            {
                ret.IsAccept = 0;
                ret.Error = ex.ToString();
            }
            return Json(ret);
        }
        [HttpPost]
        public JsonResult TitleUpdate()
        {
            var ret = new RetJsonModel();
            var titleStr = HttpUtility.UrlDecode(Request.Form["Title"]);
            var subTitleStr = HttpUtility.UrlDecode(Request.Form["SubTitle"]);
            var userIdStr = Request.Form["UserID"];
            var articeIdStr = Request.Form["ArticleID"];
            try
            {
                var articleId = long.Parse(articeIdStr);
                var userId = long.Parse(userIdStr);
                var article = _db.Articles.First(a => a.ArticleId == articleId);
                if (Session["LoggedUserID"].Equals(userIdStr) && article.AuthorId == userId)
                {
                    if (titleStr != null) article.Title = Regex.Replace(titleStr, "[^0-9a-zA-Z \u4E00-\u9FFF]+", "");
                    if (subTitleStr != null)
                        article.SubTitle = Regex.Replace(subTitleStr, "[^0-9a-zA-Z \u4E00-\u9FFF]+", "");
                    article.ModifyDate = DateTime.Now;
                    _db.SaveChanges();
                    ret.IsAccept = 1;
                    ret.UserId = article.AuthorId.ToString();
                }
                else
                {
                    ret.IsAccept = 0;
                    ret.Error = "Update Failed";
                }
            }
            catch (Exception ex)
            {
                ret.IsAccept = 0;
                ret.Error = ex.ToString();
            }
            return Json(ret);
        }

        [HttpPost]
        public async Task<string> RunCode(string codeEncoded, string language)
        {
            var codeDecoded = HttpUtility.HtmlDecode(codeEncoded);
            return await CodeHelper.GetIntance().RunCode(codeDecoded, language);
        }
        public class RetJsonModel
        {
            public int IsAccept { get; set; }
            public string UserId { get; set; }
            public string Error { get; set; }
        }



        [HttpPost]

        public async Task<string> LeaveInLineComment(string articleContent, string commentContent, long articleId)
        {
            if (Session["LoggedUserID"] == null)
            {
                return "You have not login yet";
            }
            long userId = long.Parse(Session["LoggedUserID"].ToString());
            string decodedArticleContent = WebUtility.UrlDecode(articleContent);
            string decodedCommentContent = WebUtility.UrlDecode(commentContent);
            if (decodedCommentContent.Length == 0)
            {
                return "Comment should not been empty";
            }
            var matches = Regex.Matches(decodedArticleContent, @"<span class=""range-selected"">.+</span>");
            if (matches.Count != 1)
            {
                return "We found" + matches.Count + "comments";
            }
            string matchedStr = matches[0].Value;
            string innerText = matchedStr.Replace("<span class=\"range-selected\">", "").Replace("</span>", "");
            string replacedStr;

            try
            {


                using (var db = new BlogContext())
                {
                    var article = await db.Articles.FirstOrDefaultAsync(a => a.ArticleId == articleId);
                    if (article == null)
                    {
                        return "We found 0 matched articles using your given article id :" + articleId;
                    }
                    //verfiy the content is correct
                    string contentFromDb = HttpUtility.HtmlDecode(article.Content);
                    if (!contentFromDb.Substring(0, matches[0].Index)
                            .Equals(decodedArticleContent.Substring(0, matches[0].Index)) ||
                        !contentFromDb.Substring(matches[0].Index + innerText.Length)
                            .Equals(decodedArticleContent.Substring(matches[0].Index + matches[0].Length))
                            || !contentFromDb.Substring(matches[0].Index, innerText.Length).Equals(innerText))
                    {
                        return "Don't try to modify the data other than comment";
                    }

                    InLineComment comment = new InLineComment();
                    comment.UserId = userId;
                    comment.ArticleId = articleId;
                    comment.Content = HttpUtility.HtmlEncode(decodedCommentContent);
                    comment.CreateDate = DateTime.Now;
                    comment.ReplyComment = 0;
                    comment.TargetSentence = innerText;
                    db.InLineComments.Add(comment);
                    await db.SaveChangesAsync();
                    replacedStr = matchedStr.Replace("<span class=\"range-selected\">",
                        "<span data-inlinecommentid=\"" + comment.InLineCommentId + "\">");
                    string replacedArticleContent = decodedArticleContent.Substring(0, matches[0].Index) + replacedStr +
                                                    decodedArticleContent.Substring(matches[0].Index + matches[0].Length);
                    article.Content = HttpUtility.HtmlEncode(replacedArticleContent);
                    await db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return "You have successfully added the comment";

        }


        [HttpPost]

        public async Task<string> ReplyInLineComment(string commentContent, long articleId, int replyId)
        {
            if (Session["LoggedUserID"] == null)
            {
                return "You have not login yet";
            }
            long userId = long.Parse(Session["LoggedUserID"].ToString());
            string decodedCommentContent = WebUtility.UrlDecode(commentContent);
            if (decodedCommentContent.Length == 0)
            {
                return "Comment should not been empty";
            }
            using (var db = new BlogContext())
            {
                var inlineComment =await db.InLineComments.FirstOrDefaultAsync(a => a.InLineCommentId == replyId);
                if (inlineComment == null)
                {
                    return "We could not find your replyId :" + replyId;
                }


                InLineComment comment = new InLineComment();
                comment.UserId = userId;
                comment.ArticleId = articleId;
                comment.Content = HttpUtility.HtmlEncode(decodedCommentContent);
                comment.CreateDate = DateTime.Now;
                comment.ReplyComment = replyId;
                comment.TargetSentence = inlineComment.TargetSentence;
                db.InLineComments.Add(comment);
                await db.SaveChangesAsync();
            }
            return "Secussfully reply the comment";
        }
        [HttpGet]

        public async Task<string> GetAllInLineComments(long articleId)
        {
            using (var db = new BlogContext())
            {
                var comments =  await (from i in db.InLineComments
                    join p in db.Profile
                    on i.UserId equals p.UserID
                    select  new ArticleInlineViewModel()
                    {
                      Content  = i.Content,
                      CreateDate = i.CreateDate,
                      InLineCommentId = i.InLineCommentId,
                      ReplyId = i.ReplyComment,
                      TargetSentence = i.TargetSentence,
                      UserId = i.UserId,
                      UserName = p.NickName  ?? p.Member.UserName,
                      ProfileImageName = p.ProfileImageName
                    }).ToListAsync();
                return JsonConvert.SerializeObject(comments);
            }
        }

    }
}
