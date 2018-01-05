using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using JobSearchAPI.BALModels;

namespace JobSearchAPI.DBModels
{
    public  class JobContext : DbContext
    {
        public JobContext()
            : base("name=JobContextDB")
        {
        }

        public  DbSet<Job> Jobs { get; set; }
        public DbSet<UserAction> UserActions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("JobSeeker");
            modelBuilder.Entity<Job>()
    .Property(e => e.JobDescription)
    .IsUnicode(false);

            modelBuilder.Entity<Job>()
                .Property(e => e.URL)
                .IsUnicode(false);

            modelBuilder.Entity<Job>()
                .Property(e => e.Note)
                .IsUnicode(false);

            modelBuilder.Entity<Job>()
                .Property(e => e.CreateDate)
                .HasPrecision(0);

            modelBuilder.Entity<Job>()
                .Property(e => e.LastUpdateDate)
                .HasPrecision(0);

            modelBuilder.Entity<Job>()
                .Property(e => e.WebsiteName)
                .IsUnicode(false);

            modelBuilder.Entity<Job>()
                .Property(e => e.Title)
                .IsUnicode(false);

            modelBuilder.Entity<Job>()
                .Property(e => e.SubTitle)
                .IsUnicode(false);
        }

        public async Task<List<JobSearchModel>> SearchJobsByKeywords(string keywords)
        {
          return await Database.SqlQuery<JobSearchModel>("JobSeeker.SearchJob @keywords", new SqlParameter("keywords",keywords)).ToListAsync();
        }
        public async Task<List<JobSearchModel>> SearchJobsByKeywordsLogged(string keywords,string userid)
        {
            return await Database.SqlQuery<JobSearchModel>("JobSeeker.SearchJobLogged @keywords,@userid", new SqlParameter("keywords", keywords), new SqlParameter("userid",userid)).ToListAsync();
        }
        public async Task<List<Job>> GetJobs(int? num)
        {
            return await Database.SqlQuery<Job>("JobSeeker.GetJobs @num", new SqlParameter("num", num ?? 0)).ToListAsync();
        }
    }
}
