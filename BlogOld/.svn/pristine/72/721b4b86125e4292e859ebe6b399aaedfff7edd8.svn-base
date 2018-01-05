
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Blog.Models;
using System.IO;
using System.Web.Mvc;
namespace Blog.Helper
{
    public class DatacacheHelper
    {
        private Dictionary<long, string> tags;
        private DateTime tagsUpdateTime;
        private readonly string _connStr;
        private DatacacheHelper()
        {
            _connStr = ConfigurationManager.ConnectionStrings["BlogContext"].ConnectionString;
            tags = null;
            tagsUpdateTime = DateTime.Now;
        }

        private static class DatacacheInitializeHelper
        {
            public static readonly DatacacheHelper Instance = new DatacacheHelper();
        }

        public static DatacacheHelper GetInstance()
        {
            return DatacacheInitializeHelper.Instance;
        }



        private async Task<Dictionary<long, string>> GetTagMap()
        {
            if (tags != null && (DateTime.Now - tagsUpdateTime).Hours <= 3) return tags;
            using (var db = new BlogContext(_connStr))
            {
                tags= await db.Tags.ToDictionaryAsync(a => a.TagId, a => a.TagContent);
            }
            return tags;
        }


        #region Global function

        public async Task<string> GetUserNameById(long userId)
        {
            using (var db = new BlogContext(_connStr))
            {
                var profile= await db.Profile.FirstOrDefaultAsync(a => a.UserID == userId);
                if (profile.NickName != null) return profile.NickName;
                return profile.Member.UserName;
            }
        }



        public async Task<HashSet<long>> GetAuthorIdsByName(string name)
        {
            HashSet<long> ret = new HashSet<long>();
            if (string.IsNullOrEmpty(name)) return ret;
            name = name.Trim().ToLower();
            using (var db = new BlogContext(_connStr))
            {
                var profiles = await db.Profile.Where(a => a.NickName.Trim().ToLower().Contains(name) ||
                                            string.IsNullOrEmpty(a.NickName) &&
                                            a.Member.UserName.ToLower().Trim().Contains(name)).ToListAsync();
                foreach (var profile in profiles)
                {
                    ret.Add(profile.UserID);
                }
            }

            return ret;
        }


        public async Task<string> GetTagNameById(long id)
        {
            try
            {
                return (await GetTagMap())[id];
            }
            catch (KeyNotFoundException e)
            {
                using (var db = new BlogContext(_connStr))
                {
                    tags = await db.Tags.ToDictionaryAsync(a => a.TagId, a => a.TagContent);
                    return tags[id];
                }
            }
           

        }

        public async Task<HashSet<long>> GetTagIdsByName(string tagName)
        {
            HashSet<long> matches = new HashSet<long>();
            foreach (var oneTag in await GetTagMap())
            {
                if (oneTag.Value.ToLower().Contains(tagName.ToLower().Trim()))
                {
                    matches.Add(oneTag.Key);
                }
            }
            return matches;
        }

        #endregion
        #region source host url
        public string GetIpAddress()
        {
            string ipContent = System.IO.File.ReadAllText(Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~"), "Content\\IpAddress\\ip.txt"));
            if (!string.IsNullOrEmpty(ipContent))
            {
                ipContent = ipContent.Substring(0, ipContent.IndexOf(' '));
            }
            return ipContent;
        }
#endregion
    }
}