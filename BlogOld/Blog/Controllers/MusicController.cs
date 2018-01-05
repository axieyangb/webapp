using Blog.Helper;
using Blog.Models;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Cache;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using System.Xml;

namespace Blog.Controllers
{
    public class MusicController : Controller
    {
        // GET: Music
        private string _conn;
        private MusicHelper _heler;
        private string sourceHost;
        public MusicController()
        {
            _conn = ConfigurationManager.ConnectionStrings["BlogContext"].ConnectionString;
            _heler = MusicHelper.GetInstance();
            _heler.SynchronizedThePopularList();
            sourceHost = DatacacheHelper.GetInstance().GetIpAddress();
        }
        public ActionResult Index()
        {
            return View();
        }

        public string GetFavoriteList()
        {
            List<Music> ret = new List<Music>();
            if (Session["LoggedUserID"] == null) return "";
            JavaScriptSerializer json_serializer = new JavaScriptSerializer();
            long userId = long.Parse(Session["LoggedUserID"].ToString());
            using (var db = new BlogContext(_conn))
            {
                ret = (from f in db.MusicFavorites
                       join m in db.Musics on f.MusicId equals m.ListId
                       where f.UserId == userId && f.isValid == 1
                       select m).ToList();
                foreach (var music in ret)
                {
                    music.Url = "http://" + sourceHost + "/music/" + music.Url;
                }
                return json_serializer.Serialize(ret);
            }
        }

        public async Task<bool> AddToFavoriate(string musicId)
        {
            if (string.IsNullOrEmpty(musicId) || Session["LoggedUserID"] == null) return false;
            long userId = long.Parse(Session["LoggedUserID"].ToString());
            using (var db = new BlogContext(_conn))
            {
                int? listId = db.Musics.FirstOrDefault(a => a.MusicExternalId == musicId)?.ListId;
                if (listId == null) return false;
                var favorite = db.MusicFavorites.FirstOrDefault(a => a.MusicId == listId);
                if (favorite != null && favorite.isValid == 0)
                {
                    favorite.isValid = 1;
                    favorite.CreateDate = DateTime.Now;
                    await db.SaveChangesAsync();
                    return true;
                }
                else if (favorite == null)
                {
                    MusicFavorite newFavoriate = new MusicFavorite();
                    newFavoriate.CreateDate = DateTime.Now;
                    newFavoriate.MusicId = listId;
                    newFavoriate.UserId = userId;
                    newFavoriate.isValid = 1;
                    db.MusicFavorites.Add(newFavoriate);
                    await db.SaveChangesAsync();
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        public bool RemoveFromFavoriate(string musicId)
        {
            if (string.IsNullOrEmpty(musicId) || Session["LoggedUserID"] == null) return false;
            long userId = long.Parse(Session["LoggedUserID"].ToString());
            if (string.IsNullOrEmpty(musicId)) return false;
            using (var db = new BlogContext(_conn))
            {
                int? listId = db.Musics.FirstOrDefault(a => a.MusicExternalId == musicId)?.ListId;
                if (listId == null) return false;
                MusicFavorite oneFavoriate = db.MusicFavorites.FirstOrDefault(a => a.MusicId == listId && a.isValid == 1);
                if (oneFavoriate == null) return false;
                oneFavoriate.isValid = 0;
                db.SaveChanges();
                return true;
            }
        }
        public async Task<string> SearchMusic(string keyword, int pageNum)
        {
            JavaScriptSerializer json_serializer = new JavaScriptSerializer();
            var url = "https://search.kuwo.cn/r.s?all=" + keyword + "&ft=music&itemset=web_2013&client=kt&pn=" + pageNum + "&rn=15&rformat=json&encoding=utf8";
            HttpWebRequest.DefaultCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            HttpWebRequest http = (HttpWebRequest)WebRequest.Create(url);
            http.ContentType = "application/json";
            http.UserAgent = @"User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko";
            var response = await http.GetResponseAsync();
            Stream stream = response.GetResponseStream();
            string content;
            using (StreamReader sr = new StreamReader(stream))
            {
                content = sr.ReadToEnd();
                //string decodeUrl = WebUtility.UrlDecode(content);

            }
            var songs = json_serializer.Deserialize<Songs>(content);
            urlHandler(songs);
            GetMusicUrls(songs);
            await saveMusicInfo(songs);
            return json_serializer.Serialize(ModelTransfer(songs));
        }


        private List<Music> ModelTransfer(Songs songs)
        {
            List<Music> musics = new List<Music>();
            foreach (var detail in songs.abslist)
            {
                var correspondingMusic = new Music();
                correspondingMusic.Album = detail.ALBUM;
                correspondingMusic.Artist = detail.ARTIST;
                correspondingMusic.ImgUrl = detail.MVPIC;
                correspondingMusic.MusicExternalId = detail.MUSICRID;
                correspondingMusic.MusicName = detail.SONGNAME;
                correspondingMusic.Rate = int.Parse(detail.SCORE100);
                correspondingMusic.Url = detail.URL;
                if (detail.ONLINE!=null && detail.ONLINE.StartsWith("<lyric"))
                {
                    correspondingMusic.Lyric = detail.ONLINE;
                }
                musics.Add(correspondingMusic);
            }

            return musics;


        }

        private void urlHandler(Songs songs)
        {
            foreach (Detail detail in songs.abslist)
            {
                if (!string.IsNullOrEmpty(detail.MVPIC))
                {
                    detail.MVPIC = "http://img1.kwcdn.kuwo.cn/wmvpic/" + detail.MVPIC;
                }
            }
        }

        private async Task saveMusicInfo(Songs songs)
        {

            using (var db = new BlogContext(_conn))
            {
                foreach (Detail songDetail in songs.abslist)
                {
                    Music matchedMusic = db.Musics.SingleOrDefault(a => a.MusicExternalId == songDetail.MUSICRID);
                    if (matchedMusic == null && songDetail.URL != null)
                    {
                        matchedMusic = new Music();
                        matchedMusic.Album = songDetail.ALBUM;
                        matchedMusic.Artist = songDetail.ARTIST;
                        matchedMusic.ImgUrl = songDetail.MVPIC;
                        matchedMusic.Rate = int.Parse(songDetail.SCORE100);
                        matchedMusic.MusicExternalId = songDetail.MUSICRID;
                        matchedMusic.MusicName = songDetail.SONGNAME;
                        matchedMusic.Url = songDetail.URL;
                        matchedMusic.CreateDate = DateTime.Now;
                        db.Musics.Add(matchedMusic);
                    }
                }
                await db.SaveChangesAsync();
            }

        }

        public void GetMusicUrls(Songs songs)
        {

            Thread[] threads = new Thread[songs.abslist.Count];
            for (int i = 0; i < songs.abslist.Count; i++)
            {
                var iTemp = i;
                threads[iTemp] = new Thread(() =>
                {
                    FetchUrl(songs.abslist[iTemp]);
                });
                threads[iTemp].Start();
            }

            foreach (var thread in threads)
            {
                thread.Join(30000);
            }
            foreach (var thread in threads)
            {
                while (thread.IsAlive);
            }
        }


        public void FetchUrl(Detail oneDetail)
        {
            using (var db = new BlogContext(_conn))
            {
                var oneMusic = db.Musics.FirstOrDefault(a => a.MusicExternalId == oneDetail.MUSICRID);
                if (oneMusic == null)
                {
                    oneDetail.URL = GetMusicUrl(oneDetail.MUSICRID);
                }
                else
                {
                    if (!oneMusic.Url.StartsWith("http://"))
                        oneDetail.URL = "http://" + sourceHost + "/music/" + oneMusic.Url;
                    else
                    {
                        oneDetail.URL = oneMusic.Url;
                    }
                    oneDetail.MVPIC = oneMusic.ImgUrl;
                    oneDetail.ONLINE = oneMusic.Lyric;
                }
            }
        }

        public string GetPopularList(string categoryName)
        {
            List<Music> popularMusics = _heler.GetPopularMusicsByCategoryName(categoryName);

            Thread[] threads = new Thread[popularMusics.Count];
            for (int i = 0; i < threads.Length; i++)
            {
                int iTemp = i;
                threads[i] = new Thread(async () =>
               {
                   await OneMusicUrlFetch(popularMusics[iTemp]);
               });
                threads[i].Start();
            }
            foreach (var thread in threads)
            {
                thread.Join();
            }
            return JsonConvert.SerializeObject(popularMusics);

        }

        public async Task OneMusicUrlFetch(Music music)
        {
            using (var db = new BlogContext())
            {
                var musicInDb = db.Musics.FirstOrDefault(a => a.MusicExternalId == music.MusicExternalId);
                if (musicInDb != null)
                {
                    music.ListId = musicInDb.ListId;
                    music.Rate = musicInDb.Rate;
                    music.ImgUrl = musicInDb.ImgUrl;
                    music.Url = "http://" + sourceHost + "/music/" + musicInDb.Url;
                    music.Lyric = musicInDb.Lyric;
                }
                else
                {
                    music.Rate = 0;
                    music.Url = GetMusicUrl(music.MusicExternalId);
                    music.CreateDate = DateTime.Now;
                    music.ImgUrl = "";
                    db.Musics.Add(music);
                    await db.SaveChangesAsync();
                }
            }
        }

        public string GetCategoryList()
        {
            using (var db = new BlogContext())
            {
                List<string> categoryNames = db.PopularMusics.Select(a => a.CategoryName).ToList();
                return JsonConvert.SerializeObject(categoryNames);
            }
        }

        public string GetMusicUrl(string musicId)
        {
            var url = "https://antiserver.kuwo.cn/anti.s?type=convert_url&rid=" + musicId + "&format=mp3&response=url";
            HttpWebRequest.DefaultCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            HttpWebRequest http = (HttpWebRequest)WebRequest.Create(url);
            http.UserAgent = @"User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko";
            HttpWebResponse response = (HttpWebResponse)http.GetResponse();
            var stream = response.GetResponseStream();
            Encoding encode = Encoding.GetEncoding("utf-8");
            // Reads 256 characters at a time.    
            using (StreamReader sr = new StreamReader(stream, encode))
            {
                char[] read = new char[256];
               string str = "";
                int count = sr.Read(read, 0, 256);
                while (count > 0)
                {
                    // Dumps the 256 characters on a string and displays the string to the console.
                    str += new string(read, 0, count);
                    count = sr.Read(read, 0, 256);
                }
                return str;
            }
        }

        public async Task<ActionResult> Download(string url, string musicId, string token, string fileName)
        {
            if (token == null) return Index();
            ValidationHelper helper = new ValidationHelper();
            bool isValid = false;
            isValid = await helper.GetResponse(token, null);
            if (!isValid) return Index();

            //if (url.StartsWith("/Content/music/"))
            //{
            //    var physicalPath = Path.Combine(Server.MapPath("~"), url.Substring(1).Replace("/","\\"));
            //    using (var fs = new FileStream(physicalPath, FileMode.Open, FileAccess.Read))
            //    {
            //        var br = new BinaryReader(fs);
            //        long numBytes = new FileInfo(physicalPath).Length;
            //        var buff = br.ReadBytes((int)numBytes);
            //        return File(buff, "audio/mpeg", fileName + ".mp3");
            //    }
            //}
            using (var client = new WebClient())
            {
                byte[] bytes = client.DownloadData(url);
                var res = new FileContentResult(bytes, "audio/mpeg")
                {
                    FileDownloadName = fileName + ".mp3"
                };
                return res;
            }
        }

        public async Task UpdatePlayHistory(string musicId)
        {
            if (Session["LoggedUserID"] == null) return;
            long userId = long.Parse(Session["LoggedUserID"].ToString());
            using (var db = new BlogContext(_conn))
            {
                int? listId = db.Musics.FirstOrDefault(a => a.MusicExternalId == musicId)?.ListId;
                if (listId == null) return;
                MusicPlayHistory oneHistory = db.MusicPlayHistories.FirstOrDefault(a => a.MusicId == listId);
                if (oneHistory == null)
                {
                    oneHistory = new MusicPlayHistory();
                    oneHistory.UserId = userId;
                    oneHistory.MusicId = listId;
                    db.MusicPlayHistories.Add(oneHistory);
                }
                oneHistory.LastPlayedDate = DateTime.Now;
                await db.SaveChangesAsync();
            }
        }

    }

}