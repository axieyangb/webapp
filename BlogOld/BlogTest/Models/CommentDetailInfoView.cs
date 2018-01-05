﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogTest.Models
{
    [Table("CommentDetailInfoView")]
    public class CommentDetailInfoView
    {
        [Key]
        [Column("CommentID")]
        public long CommentId { set; get; }
        [Column("CommenterID")]
        public long CommenterId { get; set; }
        [Column("ArticleID")]
        public long ArticleId { get; set; }
        [Column("ReplyID")]
        public long ReplyId { set; get; }
        [Column("CreateDate")]
        public DateTime CreateDate { set; get; }
        [Column("CommentName")]
        public string CommentName {set;get;}
        [Column("Country")]
        public string Country { set; get; }
        [Column("Content")]
        public string Content { set; get; }
    }
}