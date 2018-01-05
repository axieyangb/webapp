namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Blog.InLineComment")]
    public partial class InLineComment
    {
        [Key]
        [Column("InLineCommentId")]
        public int InLineCommentId { get; set; }

        public long UserId { get; set; }

        public long ArticleId { get; set; }

        public string Content { get; set; }
        public string TargetSentence { get; set; }

        public int ReplyComment { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CreateDate { get; set; }

        public  int Deleted { get; set; }
    }
}
