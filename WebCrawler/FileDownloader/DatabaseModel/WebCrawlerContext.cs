namespace FileDownloader.DatabaseModel
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class WebCrawlerContext : DbContext
    {
        public WebCrawlerContext()
            : base("name=WebCrawlerContext")
        {
        }

        public virtual DbSet<Source> Sources { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Source>()
                .Property(e => e.SourceTypeName)
                .IsUnicode(false);

            modelBuilder.Entity<Source>()
                .Property(e => e.Duration)
                .IsUnicode(false);

            modelBuilder.Entity<Source>()
                .Property(e => e.CreateDate)
                .HasPrecision(0);
        }
    }
}
