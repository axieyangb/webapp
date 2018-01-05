using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Blog.Models;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Blog.Models.ViewModel;
using static Blog.Models.ViewModel.ArticleSnippetViewModel;
using Blog.Helper;

namespace Blog.Controllers
{
    public class UserController : Controller
    {
        private string _connStr;
        private DatacacheHelper helper;
        public UserController()
        {
            _connStr = ConfigurationManager.ConnectionStrings["BlogContext"].ConnectionString;
            helper = DatacacheHelper.GetInstance();


        }
        // GET: User
        public async Task<ActionResult> Index(int id)
        {
            using (var db = new BlogContext(_connStr))
            {
                Profile profile =await db.Profile.FindAsync(id);
                return View(profile);
            }
        }


        public async Task<int> GetPostArticles(int userId)
        {
            using (var db = new BlogContext(_connStr))
            {
              return await db.Articles.CountAsync(a => a.AuthorId == userId);
            }
        }

        public async Task<int> GetPostPhotos(int userId)
        {
            using (var db = new BlogContext(_connStr))
            {
                return await db.Images.CountAsync(a => a.UserId == userId);
            }
        }

        public async Task<int> GetComments(int userId)
        {
            using (var db = new BlogContext(_connStr))
            {
                return await db.ArticleComments.CountAsync(a => a.CommenterId == userId);
            }
        }

        public async Task<string> GetMostRecentArticles(int userId, int skipNum, int takeNum)
        {

            using (var db = new BlogContext(_connStr))
            {
                List<ArticleSnippetViewModel> ret = new List<ArticleSnippetViewModel>();
                List<Article> articles =await db.Articles.Where(a => a.AuthorId == userId && a.IsRemoved == 0).OrderByDescending(a => a.PostDate).Skip(skipNum).Take(takeNum).ToListAsync();
                foreach(var article in articles){
                    {
                        ArticleSnippetViewModel snippet = new ArticleSnippetViewModel();
                        snippet.PostDate = article.PostDate;
                        snippet.ArticleId = article.ArticleId;
                        snippet.AuthorId = article.AuthorId;
                        snippet.AuthorName = await helper.GetUserNameById(article.AuthorId);
                        snippet.SubTitle = article.SubTitle;
                        snippet.Title = article.Title;
                        if (article.TagId1 != null)
                        {
                            snippet.Tags.Add(new Pair(article.TagId1.ToString(), await helper.GetTagNameById((long)article.TagId1)));
                        }
                        if (article.TagId2 != null)
                        {
                            snippet.Tags.Add(new Pair(article.TagId2.ToString(), await helper.GetTagNameById((long)article.TagId2)));
                        }
                        if (article.TagId3 != null)
                        {
                            snippet.Tags.Add(new Pair(article.TagId3.ToString(), await helper.GetTagNameById((long)article.TagId3)));
                        }
                        if (article.TagId4 != null)
                        {
                            snippet.Tags.Add(new Pair(article.TagId4.ToString(), await helper.GetTagNameById((long)article.TagId4)));
                        }
                        if (article.TagId5 != null)
                        {
                            snippet.Tags.Add(new Pair(article.TagId5.ToString(), await helper.GetTagNameById((long)article.TagId5)));
                        }
                        ret.Add(snippet);
                    }
                }
                return JsonConvert.SerializeObject(ret);
            }
        }
    }
}