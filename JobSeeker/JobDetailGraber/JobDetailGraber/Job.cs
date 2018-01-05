using System.Data.Entity;

namespace JobDetailGraber
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public class JobContext : DbContext
    {
        public JobContext()
            : base("name=Job")
        {
        }

        public virtual DbSet<Job> Jobs { get; set; }
        [Table("JobSeeker.Jobs")]
        public class Job
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

            [StringLength(25)]
            public string WebsiteName { get; set; }

            [StringLength(200)]
            public string Title { get; set; }

            public string SubTitle { get; set; }

            public int Status { get; set; }

            public int InValidNum { get; set; }

            public int VisitedNum { get; set; }

            public int ThumbsUpNum { get; set; }
        }
    }

 
}
