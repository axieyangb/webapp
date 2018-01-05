﻿using System.Data.Entity;

namespace BlogTest.Models
{
    public class BlogContext :DbContext
    {
        public BlogContext(string connString):base(connString)
        {
        }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<ImageViewModel> Images { get; set; }
        public DbSet<ArticleComment> ArticleComments { get; set; }
        public DbSet<CommentDetailInfoView> CommentDetailInfo { get; set; }
        public DbSet<PublicImageModel> PublicImages { get; set; }
        public DbSet<PublicImageViewModel> PublicImagesVw { get; set; }
        public DbSet<ImageMetaDataModel> ImageMetaData { get; set; }
        public DbSet<Tags> Tags { get; set; }
    }
}