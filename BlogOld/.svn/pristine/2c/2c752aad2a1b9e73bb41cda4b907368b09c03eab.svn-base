using System;
using System.Collections.Generic;

namespace Blog.Models.ViewModel
{
    public class ArticleSnippetViewModel
    {

        public class Pair
        {
            public Pair(string k, string v)
            {
                Key = k;
                Value = v;
            }
            public string Key { get; set; }
            public string Value { get; set; }
        }


        public ArticleSnippetViewModel()
        {
            Tags = new List<Pair>();
        }

        public long ArticleId { get; set; }

        public long AuthorId { get; set; }

        public string Title { get; set; }

        public string SubTitle { get; set; }

        public DateTime PostDate { get; set; }

        public string AuthorName { get; set; }

        public List<Pair> Tags { get; set; }
    }

    public class ArticleInlineViewModel
    {
        public int InLineCommentId { get; set; }

        public long UserId { get; set; }

        public string UserName { get; set; }
        public string Content { get; set; }
        public string TargetSentence { get; set; }

        public string ProfileImageName { get; set; }

        public int ReplyId { get; set; }
        public DateTime? CreateDate { get; set; }

    }
}