using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Blog.Models
{
    public class Songs
    {
        public string ARTISTPIC;
        public int HIT;

        public string HITMODE;

        public int HIT_BUT_OFFLINE;

        public int MSHOW;

        public int NEW;

        public int PN;

        public int RN;

        public int SHOW;

        public int TOTAL;
        public List<Detail> abslist;
        public Songs()
        {
            abslist = new List<Detail>();
        }
    }

    public class Detail
    {
        public string ALBUM;
        public string ALBUMID;
        public string ARTIST;
        public string ARTISTID;
        public string COPYRIGHT;
        public string FORMATS;
        public string HASECHO;
        public string IS_EXT;
        public string IS_POINT;
        public string MKVNSIG1;
        public string MKVNSIG2;
        public string MKVRID;
        public string MP3NSIG1;
        public string MP3NSIG2;
        public string MP3RID;
        public string MUSICRID;
        public string MUTI_VER;
        public string MVPIC;
        public string NEW;
        public string NSIG1;
        public string NSIG2;
        public string ONLINE;
        public string PAY;
        public string SCORE100;
        public string SONGNAME;
        public string UPLOADER;
        public string UPTIME;
        public string URL;
    }
}