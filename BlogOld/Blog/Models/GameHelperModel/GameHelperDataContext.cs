namespace Blog.Models.GameHelperModel
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public class GameHelperDataContext : DbContext
    {
        public GameHelperDataContext()
            : base("name=GameHelperDataContext")
        {
        }

        public virtual DbSet<BuildPath> BuildPaths { get; set; }
        public virtual DbSet<CommercialBuilding> CommercialBuildings { get; set; }
        public virtual DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CommercialBuilding>()
                .Property(e => e.BuildingName)
                .IsUnicode(false);

            modelBuilder.Entity<Item>()
                .Property(e => e.ItemName)
                .IsUnicode(false);

            modelBuilder.Entity<Item>()
                .Property(e => e.MeterialsRequiredDesc)
                .IsUnicode(false);

            modelBuilder.Entity<Item>()
                .HasMany(e => e.BuildPaths)
                .WithRequired(e => e.Item)
                .HasForeignKey(e => e.ComponentId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Item>()
                .HasMany(e => e.BuildPaths1)
                .WithRequired(e => e.Item1)
                .HasForeignKey(e => e.ItemId)
                .WillCascadeOnDelete(false);
        }
    }
}
