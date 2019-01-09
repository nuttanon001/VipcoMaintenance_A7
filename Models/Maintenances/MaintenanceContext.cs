using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace VipcoMaintenance.Models.Maintenances
{
    public class MaintenanceContext : DbContext
    {
        public MaintenanceContext(DbContextOptions<MaintenanceContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdjustStockSp>().ToTable("AdjustStockSp");
            modelBuilder.Entity<Branch>().ToTable("Branch");
            modelBuilder.Entity<Item>().ToTable("Item");
            modelBuilder.Entity<ItemMainHasEmployee>().ToTable("ItemMainHasEmployee");
            modelBuilder.Entity<ItemMaintenance>().ToTable("ItemMaintenance");
            modelBuilder.Entity<ItemType>().ToTable("ItemType");
            modelBuilder.Entity<MovementStockSp>().ToTable("MovementStockSp");
            modelBuilder.Entity<Permission>().ToTable("Permission");
            modelBuilder.Entity<ReceiveStockSp>().ToTable("ReceiveStockSp");
            modelBuilder.Entity<RequireMaintenance>().ToTable("RequireMaintenance");
            modelBuilder.Entity<RequireMaintenanceHasAttach>().ToTable("RequireMaintenanceHasAttach");
            modelBuilder.Entity<RequisitionStockSp>().ToTable("RequisitionStockSp");
            modelBuilder.Entity<SparePart>().ToTable("SparePart");
            modelBuilder.Entity<TypeMaintenance>().ToTable("TypeMaintenance");
            modelBuilder.Entity<WorkGroup>().ToTable("WorkGroup");
            modelBuilder.Entity<WorkGroupMaintenance>().ToTable("WorkGroupMaintenance");
        }

        // Dbset
        public DbSet<AdjustStockSp> AdjustStockSps { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemMainHasEmployee> ItemMainHasEmployees { get; set; }
        public DbSet<ItemMaintenance> ItemMaintenances { get; set; }
        public DbSet<ItemType> ItemTypes { get; set; }
        public DbSet<MovementStockSp> MovementStockSps { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<ReceiveStockSp> ReceiveStockSps { get; set; }
        public DbSet<RequireMaintenance> RequireMaintenances { get; set; }
        public DbSet<RequireMaintenanceHasAttach> RequireMaintenanceHasAttaches { get; set; }
        public DbSet<RequisitionStockSp> RequisitionStockSps { get; set; }
        public DbSet<SparePart> SpareParts { get; set; }
        public DbSet<TypeMaintenance> TypeMaintenances { get; set; }
        public DbSet<WorkGroup> WorkGroups { get; set; }
        public DbSet<WorkGroupMaintenance> WorkGroupMaintenances { get; set; }
    }
}
