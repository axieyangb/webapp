using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;

namespace Blog.Models.GlobalCommonModel
{
    public static class Definition
    {
        public enum SearchType
        {
            None=0,
            Title=1,
            SubTitle=2,
            Author=3,
            TagName = 4,
            Year =5,
            Month=6,
            Day=7,
            Content=8
        }

        public enum FilterType
        {
            None = 0,
            TagId = 1,
            AuthorId = 2,
            Month = 3
        }

        public class SearchOption
        {
            public SearchType Type { set; get; }
            public string Content { set; get; }
        }


        public class FilterOption
        {
            public FilterType Type { get; set; }
            public string Content { get; set; }
        }
        public class Scope
        {
            public int Start { get; set; }
            public int End { get; set; }
        }
        public enum OrderType
        {
            None=0,
            PostTimeAsc=1,
            PostTimeDesc=2,
            TitleNameAsc=3,
            TitleNameDesc=4,
            AuthorAsc=5,
            AuthorDesc=6
        }
    }
}