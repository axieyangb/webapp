using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Configuration;
using System.Data;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Blog.Models.GlobalCommonModel;

namespace Blog.Models
{
    public class BlogContext :DbContext
    {
        public BlogContext(): base("BlogContext")
        {
            //throw new NotImplementedException();
        }
        public BlogContext(string connString):base(connString)
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PopularMusic>()
               .Property(e => e.CreateDate)
               .HasPrecision(0);
            modelBuilder.HasDefaultSchema("Blog");
            modelBuilder.Entity<Member>()
                .HasOptional(e => e.Profile)
                .WithRequired(e => e.Member);

            modelBuilder.Entity<Profile>()
                .Property(e => e.CreateDate)
                .HasPrecision(0);

            modelBuilder.Entity<Profile>()
                .Property(e => e.LastUpdateDate)
                .HasPrecision(0);
        }

        public virtual DbSet<PopularMusic> PopularMusics { get; set; }
        public virtual DbSet<SouceCode> SouceCode { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<ImageViewModel> Images { get; set; }
        public DbSet<ArticleComment> ArticleComments { get; set; }
        public DbSet<CommentDetailInfoView> CommentDetailInfo { get; set; }
        public DbSet<PublicImageModel> PublicImages { get; set; }
        public DbSet<PublicImageViewModel> PublicImagesVw { get; set; }
        public DbSet<ImageMetaDataModel> ImageMetaData { get; set; }
        public DbSet<Tags> Tags { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<FeedbackHistory> FeedbackHistory { get; set; }
        public DbSet <MusicFavorite> MusicFavorites { get; set; }
        public DbSet<MusicPlayHistory> MusicPlayHistories { get; set; }
        public  DbSet<HolidayLookUp> HolidayLookUps { get; set; }
        public DbSet<Profile> Profile { get; set; }

        public virtual DbSet<InLineComment> InLineComments { get; set; }
        public virtual DbSet<AttachFile> AttachFiles { get; set; }
        public virtual DbSet<TripRecord> TripRecords { get; set; }

        public virtual Task<List<Article>> GetArticlesByKeywords(string keywords, Definition.Scope scope)
        {

            SqlParameter keywordParam = new SqlParameter("@keywords", keywords);
            SqlParameter startParam = new SqlParameter("@start", scope.Start);
            SqlParameter endParam = new SqlParameter("@end", scope.End);
            return Database.SqlQuery<Article>("exec Blog.SearchArticleContent @keywords, @start, @end", keywordParam,startParam,endParam).ToListAsync();
          
        }
    }
}