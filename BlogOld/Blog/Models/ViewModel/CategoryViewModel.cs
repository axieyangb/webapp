using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Blog.Models.ViewModel
{
    public class MonthCategoryViewModel
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Count { get; set; }
    }

    public class AuthorCategoryViewModel
    {
        public string AuthorName { get; set; }
        public long AuthorId { get; set; }
        public int Count { get; set; }
    }
}