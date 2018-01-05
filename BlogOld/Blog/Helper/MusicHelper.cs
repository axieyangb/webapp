using NSoup;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NSoup.Nodes;
using NSoup.Select;
using Newtonsoft.Json;
using Blog.Models.ViewModel;
using Blog.Models;
using System.Threading;

namespace Blog.Helper
{
    public class MusicHelper
    {
        private  DateTime LastSyncTime;
        private MusicHelper()
        {

        }
        private static class MusicHelperInitializer{
            public static readonly MusicHelper instance = new MusicHelper();
        }

        public static MusicHelper GetInstance()
        {
            return MusicHelperInitializer.instance;
        }


        public  void SynchronizedThePopularList()
        {
            if(LastSyncTime!=null && (DateTime.Now - LastSyncTime).Days <= 1)
            {
                return;
            }
            List<PopularMusic> popularList= new List<PopularMusic>();
            using (var db = new BlogContext())
            {
               popularList = db.PopularMusics.ToList();
            }
            LastSyncTime = DateTime.Now;
            new Thread(() =>
            {
                Thread.CurrentThread.IsBackground = true;
                foreach(var pop in popularList)
                {
                    var ret = FetchPopularMusicsByCategoryName(pop.CategoryName);
                    using(var db = new BlogContext())
                    {
                        var popInDb = db.PopularMusics.Find(pop.CategoryId);
                        if (popInDb != null)
                        {
                            popInDb.MusicList = XMLHelper.Serialize(ret);
                            popInDb.CreateDate = DateTime.Now;
                        }
                        db.SaveChanges();
                    }
                }
            }).Start();
        }


        private List<PopularSongViewModel> FetchPopularMusicsByCategoryName(string categoryName)
        {
            IConnection connection = NSoupClient.Connect("http://www.kuwo.cn/bang/content?name="+ categoryName);
            connection.Timeout(30000);
            Document doc = connection.Get();
            String html = doc.Html();
            Elements musics = doc.Select(".tools");
            List<PopularSongViewModel> ret = new List<PopularSongViewModel>();
            foreach(Element music in musics){
               string jsonStr = music.Attr("data-music");
                ret.Add(JsonConvert.DeserializeObject<PopularSongViewModel>(jsonStr));
            }
            return ret;
        }



        public List<Music> GetPopularMusicsByCategoryName(string categoryName)
        {
            List<Music> ret = new List<Music>();
            using(var db = new BlogContext())
            {
               var oneCategory = db.PopularMusics.FirstOrDefault(a => a.CategoryName.Equals(categoryName));
                if (oneCategory == null)
                {
                    return ret;
                }
                List<PopularSongViewModel> top100 = XMLHelper.Deserialize<List<PopularSongViewModel>>(oneCategory.MusicList);
                foreach( var oneSongViewModel in top100)
                {
                    Music oneMusic = new Music();
                    oneMusic.MusicExternalId = oneSongViewModel.id;
                    oneMusic.MusicName = oneSongViewModel.name;
                    oneMusic.Artist = oneSongViewModel.artist;
                    oneMusic.Album = oneSongViewModel.album;
                    oneMusic.CreateDate = DateTime.Now;
                    ret.Add(oneMusic);
                }
                return ret;
            }
        }
    }
}