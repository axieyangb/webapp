namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Blog.FeedbackHistory")]
    public partial class FeedbackHistory
    {
        [Key]
        public int FeedbackId { get; set; }

        public long? ImageId { get; set; }

        public long? ArticleId { get; set; }

        public int FeedbackType { get; set; }

        [Required]
        [StringLength(20)]
        public string IpAddress { get; set; }

        public string Content { get; set; }

        public long? UserId { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime CreateTime { get; set; }
    }
}
