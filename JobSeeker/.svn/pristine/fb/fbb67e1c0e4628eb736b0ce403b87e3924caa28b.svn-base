using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;

namespace JobSearchAPI.DBModels
{
    public class AuthContext:IdentityDbContext<IdentityUser>
    {
        public AuthContext() : base("name=JobContextDB") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("JobSeeker");
            base.OnModelCreating(modelBuilder);
        }
    }
}