using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Blog.Helper;

namespace Blog.Models.ViewModel
{
    public class DashboardCalendarViewModel
    {

        public int SessionId { get; set; }
        public string Name { get; set; }
        public GuidHelper.ShortGuid SessionGuid { get; set; }
        public DateTime CreateDate { get; set; }

        public int EventNum { get; set; }

        public int CalendarsNum { get; set; }
        public bool IsCreator { get; set; }

        public List<Invitor> Invitors { get; set; }


    }

    public class Invitor
    {
        public string Name { get; set; }
        public long? UserId { get; set; }
    }
}