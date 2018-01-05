using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;

namespace JobSeeker.DBModel
{
    public  class JobContext : DbContext
    {
        public JobContext()
            : base("name=JobSeeker")
        {
        }

        public virtual DbSet<Job> Jobs { get; set; }
        public virtual DbSet<Source> Sources { get; set; }
        public virtual DbSet<DuplicateJobs> DuplicateJobses { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("JobSeeker");
        }

        [Table("JobSeeker.Jobs")]
        public class Job
        {
            [Key]
            public int Id { get; set; }

            public string JobDescription { get; set; }

            public string URL { get; set; }

            public int Depth { get; set; }

            public bool IsVisited { get; set; }

           
            [StringLength(255)]
            public string Note { get; set; }

            [Column(TypeName = "datetime2")]
            public DateTime? CreateDate { get; set; }

            [Column(TypeName = "datetime2")]
            public DateTime? LastUpdateDate { get; set; }

            public  string WebsiteName { get; set; }
            public string Title { get; set; }
            public string SubTitle { get; set; }
            public int Status { get; set; }

            public int InValidNum { get; set; }

            public int ThumbsUpNum { get; set; }

            public int VisitedNum { get; set; }
        }

        [Table("JobSeeker.DuplicateJobs")]
        public class DuplicateJobs
        {
            public int Id { get; set; }

            public string JobDescription { get; set; }

            public string URL { get; set; }

            public int Depth { get; set; }

            public bool IsVisited { get; set; }


            [StringLength(255)]
            public string Note { get; set; }

            [Column(TypeName = "datetime2")]
            public DateTime? CreateDate { get; set; }

            [Column(TypeName = "datetime2")]
            public DateTime? LastUpdateDate { get; set; }

            public string WebsiteName { get; set; }
            public string Title { get; set; }
            public string SubTitle { get; set; }
        }

        [Table("JobSeeker.Source")]
        public  class Source
        {
            [Key]
            public int Id { get; set; }

            [StringLength(255)]
            public string Keywords { get; set; }

            [StringLength(255)]
            public string Location { get; set; }

            public int? Count { get; set; }

            [Column(TypeName = "datetime2")]
            public DateTime? CreateDate { get; set; }

            [Column(TypeName = "datetime2")]
            public DateTime? LastUpdateDate { get; set; }

            public int? Active { get; set; }

        }
    }
}
