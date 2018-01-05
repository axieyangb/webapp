namespace Blog.Models.CalendarDataModel
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class CalendarContext : DbContext
    {
        public CalendarContext()
            : base("name=BlogContext")
        {
        }

        public virtual DbSet<Event> Events { get; set; }
        public virtual DbSet<Session> Sessions { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<EventUser> EventUsers { get; set; }
        public virtual DbSet<InvitedOrganizar> InvitedOrganizars { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Event>()
                .Property(e => e.Color)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Event>()
                .Property(e => e.CreateDate)
                .HasPrecision(0);

            modelBuilder.Entity<Session>()
                .Property(e => e.CreateDate)
                .HasPrecision(0);

            modelBuilder.Entity<User>()
                .Property(e => e.Email)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.CellPhone)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.PhoneCarrier)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.CreateDate)
                .HasPrecision(0);

            modelBuilder.Entity<EventUser>()
                .Property(e => e.CreateDate)
                .HasPrecision(0);
        }
    }
}
