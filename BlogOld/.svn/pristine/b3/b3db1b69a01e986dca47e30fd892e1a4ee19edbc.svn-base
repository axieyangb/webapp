using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Blog.Helper;
using Blog.Models;
using Blog.Models.GlobalCommonModel;
using Blog.Models.ViewModel;
using Chart.Mvc.Extensions;
using Newtonsoft.Json;
using Simple.ImageResizer;
using static Blog.Models.GlobalCommonModel.Definition;
using static Blog.Models.ViewModel.ArticleSnippetViewModel;
using static Blog.Helper.MusicHelper;

namespace Blog.Controllers
{
    public class HomeController : Controller
    {
        public string connStr;
        private DatacacheHelper helper;
        public HomeController()
        {
            connStr = ConfigurationManager.ConnectionStrings["BlogContext"].ConnectionString;
            helper = DatacacheHelper.GetInstance();
        }

        //
        // GET: /Home/
        [System.Web.Mvc.HttpGet]
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult AboutMe()
        {
            return View();
        }

        public ActionResult SitemapXml()
        {
            string xml = SiteMapHelper.GenerateXmlFile();
            return Content(xml, "text/xml", Encoding.UTF8);
        }

        #region Ajax Helper


        public async Task<string> GetTagList()
        {
            using (var db = new BlogContext())
            {
                List<Tags> tags = await db.Tags.ToListAsync();
                for (var i = 0; i < tags.Count; i++)
                {
                    var tag = tags[i];
                    tag.TagCount = db.Articles.Count(a => (a.TagId1 == tag.TagId || a.TagId2 == tag.TagId ||
                                                     a.TagId3 == tag.TagId || a.TagId4 == tag.TagId ||
                                                     a.TagId5 == tag.TagId) && a.IsRemoved == 0);
                }
                return JsonConvert.SerializeObject(tags.OrderByDescending(a => a.TagCount).ToList());
            }
        }


        public async Task<string> GetMonthList()
        {
            using (var db = new BlogContext())
            {
                var categoryList = await (from a in db.Articles
                                          where a.IsRemoved == 0
                                          group a by new
                                          {
                                              a.PostDate.Year,
                                              a.PostDate.Month
                                          }
                    into aGroup
                                          orderby aGroup.Key.Year descending, aGroup.Key.Month descending
                                          select new MonthCategoryViewModel()
                                          {
                                              Month = aGroup.Key.Month,
                                              Year = aGroup.Key.Year,
                                              Count = aGroup.Count()
                                          }
                ).ToListAsync();
                return JsonConvert.SerializeObject(categoryList);
            }
        }

        public async Task<string> GetAuthorList()
        {
            using (var db = new BlogContext())
            {
                var categoryList = await (from a in db.Articles
                                          join m in db.Members
                    on a.AuthorId equals m.UserID
                                          where a.IsRemoved == 0 && m.isActive == 1
                                          select m into am
                                          group am by am into aGroup
                                          orderby aGroup.Count() descending
                                          select new AuthorCategoryViewModel()
                                          {
                                              AuthorName = aGroup.Key.Profile.NickName ?? aGroup.Key.UserName,
                                              Count = aGroup.Count(),
                                              AuthorId = aGroup.Key.UserID
                                          }

                ).ToListAsync();
                return JsonConvert.SerializeObject(categoryList);
            }
        }
        public async Task<string> GetArticleList(OrderType orderType, FilterOption filterType, SearchOption searchType, Scope scope)
        {

            if (scope != null && scope.End <= scope.Start) return JsonConvert.SerializeObject(new List<ArticleSnippetViewModel>());            
            using (var db = new BlogContext(connStr))
            {
                IQueryable<Article> query;
                if (searchType != null && searchType.Type == SearchType.Content)
                {
                    query = await GetArticleListByKeyWord(searchType.Content, scope);
                }
                else
                {
                    query = db.Articles.Where(a => a.IsRemoved == 0);
                }


                if (searchType != null && searchType.Type != SearchType.None && searchType.Type != SearchType.Content)
                {
                    query = await AddSearchCriteria(query, searchType);
                }
                if (filterType != null && filterType.Type != FilterType.None)
                {
                    query = AddFilterCriteria(query, filterType);
                }

                query = AddOrderType(query, orderType);
                if (scope != null)
                {
                    query = query.Skip(scope.Start).Take(scope.End - scope.Start);
                }
                try
                {
                    List<Article> articles =  query.ToList();
                    return await GetSinppetList(articles);


                }
                catch (Exception e)
                {

                    return e.Message;
                }
            }
        }

        private async Task<string> GetSinppetList(List<Article> articles)
        {
            List<ArticleSnippetViewModel> ret = new List<ArticleSnippetViewModel>();
            foreach (var article in articles)
            {
                ArticleSnippetViewModel snippet = new ArticleSnippetViewModel();
                snippet.PostDate = article.PostDate.ToUniversalTime();
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
            return JsonConvert.SerializeObject(ret);
        }

        public async Task<IQueryable<Article>> GetArticleListByKeyWord(string keyword, Scope scope)
        {
            using (var db = new BlogContext())
            {
                try
                {
                    var articleList =  await db.GetArticlesByKeywords(keyword, scope);
                    return articleList.AsQueryable();
                }
                catch (Exception e)
                {
                    //todo
                    return null;
                }


            }
        }
        private async Task<IQueryable<Article>> AddSearchCriteria(IQueryable<Article> query, SearchOption filter)
        {
            if (filter.Type == SearchType.None)
            {
                return query;
            }
            if (filter.Type == SearchType.Author)
            {
                HashSet<long> userids = await helper.GetAuthorIdsByName(filter.Content);
                return query.Where(a => userids.Contains(a.AuthorId));
            }

            if (filter.Type == SearchType.TagName)
            {
                HashSet<long> matchesTagIds = await helper.GetTagIdsByName(filter.Content);
                return query.Where(a => a.TagId1 != null && matchesTagIds.Contains((long)a.TagId1) ||
                                        a.TagId2 != null && matchesTagIds.Contains((long)a.TagId2) ||
                                        a.TagId3 != null && matchesTagIds.Contains((long)a.TagId3) ||
                                        a.TagId4 != null && matchesTagIds.Contains((long)a.TagId4) ||
                                        a.TagId5 != null && matchesTagIds.Contains((long)a.TagId5));
            }

            DateTime searchTime;
            if (filter.Type == SearchType.Day)
            {
                if (DateTime.TryParse(filter.Content, out searchTime))
                {
                    return query.Where(a => DbFunctions.TruncateTime(a.PostDate) == searchTime.Date);
                }
                return query;
            }
            if (filter.Type == SearchType.Month)
            {
                if (DateTime.TryParse(filter.Content, out searchTime))
                {
                    return query.Where(a => a.PostDate.Month == searchTime.Month && a.PostDate.Year == searchTime.Year);
                }
                return query;
            }
            if (filter.Type == SearchType.Year)
            {
                int year;
                if (int.TryParse(filter.Content, out year))
                {
                    return query.Where(a => a.PostDate.Year == year);
                }
                return query;
            }
            if (filter.Type == SearchType.SubTitle)
            {
                return query.Where(a => a.SubTitle.ToLower().Contains(filter.Content.ToLower().Trim()));
            }
            if (filter.Type == SearchType.Title)
            {
                return query.Where(a => a.Title.ToLower().Contains(filter.Content.ToLower().Trim()));
            }
            return query;
        }


        private  IQueryable<Article> AddFilterCriteria(IQueryable<Article> query, FilterOption filter)
        {
            if (filter.Type == FilterType.None)
            {
                return query;
            }
            if (filter.Type == FilterType.TagId)
            {

                return query.Where(a => a.TagId1 != null && a.TagId1.ToString() == filter.Content ||
                                        a.TagId2 != null && a.TagId2.ToString() == filter.Content ||
                                        a.TagId3 != null && a.TagId3.ToString() == filter.Content ||
                                        a.TagId4 != null && a.TagId4.ToString() == filter.Content ||
                                        a.TagId5 != null && a.TagId5.ToString() == filter.Content);
            }
            if (filter.Type == FilterType.AuthorId)
            {
                long authorId;
                if (long.TryParse(filter.Content, out authorId))
                {
                    return query.Where(a => a.AuthorId == authorId);
                }
                return query;
            }
            if (filter.Type == FilterType.Month)
            {
                DateTime searchTime;
                if (DateTime.TryParse(filter.Content, out searchTime))
                {
                    return query.Where(a => a.PostDate.Month == searchTime.Month && a.PostDate.Year == searchTime.Year);
                }
                return query;
            }
            return query;
        }

        private IQueryable<Article> AddOrderType(IQueryable<Article> query, OrderType ordertype)
        {
            if (ordertype == OrderType.AuthorAsc)
            {
                return query.OrderBy(a => helper.GetUserNameById(a.AuthorId));
            }
            if (ordertype == OrderType.AuthorDesc)
            {
                return query.OrderByDescending(a => helper.GetUserNameById(a.AuthorId));
            }
            if (ordertype == OrderType.PostTimeAsc)
            {
                return query.OrderBy(a => a.PostDate);
            }
            if (ordertype == OrderType.TitleNameAsc)
            {
                return query.OrderBy(a => a.Title);
            }
            if (ordertype == OrderType.TitleNameDesc)
            {
                return query.OrderByDescending(a => a.Title);
            }
            return query.OrderByDescending(a => a.PostDate);
        }
        #endregion

    }


}
