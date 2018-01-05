namespace WebCrawler.DatabaseModel
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class CrawlerContext : DbContext
    {
        public CrawlerContext()
            : base("name=CrawlerContext")
        {
        }

        public virtual DbSet<DeepSite> DeepSites { get; set; }
        public virtual DbSet<Source> Sources { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DeepSite>()
                .Property(e => e.CreateDate)
                .HasPrecision(0);

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
