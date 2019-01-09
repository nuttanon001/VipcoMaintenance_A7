using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace VipcoMaintenance.Models.Machines
{
    public partial class MachineContext : DbContext
    {
        public MachineContext(DbContextOptions<MachineContext> options)
            : base(options)
        { }
        public virtual DbSet<AttachFile> AttachFile { get; set; }
        public virtual DbSet<Employee> Employee { get; set; }
        public virtual DbSet<EmployeeGroup> EmployeeGroup { get; set; }
        public virtual DbSet<EmployeeGroupMis> EmployeeGroupMis { get; set; }
        public virtual DbSet<ProjectCodeMaster> ProjectCodeMaster { get; set; }
        public virtual DbSet<User> User { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AttachFile>(entity =>
            {
                entity.Property(e => e.FileAddress)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.FileName).HasMaxLength(100);
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.EmpCode);

                entity.HasIndex(e => e.GroupMis);

                entity.Property(e => e.EmpCode).ValueGeneratedNever();

                entity.Property(e => e.GroupCode).HasMaxLength(100);

                entity.Property(e => e.GroupMis)
                    .HasColumnName("GroupMIS")
                    .HasMaxLength(100);

                entity.Property(e => e.GroupName).HasMaxLength(100);

                entity.Property(e => e.NameEng).HasMaxLength(100);

                entity.Property(e => e.NameThai)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Title).HasMaxLength(20);

                entity.HasOne(d => d.GroupMisNavigation)
                    .WithMany(p => p.Employee)
                    .HasForeignKey(d => d.GroupMis);
            });

            modelBuilder.Entity<EmployeeGroup>(entity =>
            {
                entity.HasKey(e => e.GroupCode);

                entity.Property(e => e.GroupCode).ValueGeneratedNever();

                entity.Property(e => e.Description).HasMaxLength(200);

                entity.Property(e => e.Remark).HasMaxLength(200);
            });

            modelBuilder.Entity<EmployeeGroupMis>(entity =>
            {
                entity.HasKey(e => e.GroupMis);

                entity.ToTable("EmployeeGroupMIS");

                entity.Property(e => e.GroupMis)
                    .HasColumnName("GroupMIS")
                    .HasMaxLength(100)
                    .ValueGeneratedNever();

                entity.Property(e => e.GroupDesc).HasMaxLength(250);

                entity.Property(e => e.Remark).HasMaxLength(250);
            });

            modelBuilder.Entity<ProjectCodeMaster>(entity =>
            {
                entity.Property(e => e.ProjectCode)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.ProjectName).HasMaxLength(200);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.EmpCode);

                entity.Property(e => e.LevelUser).HasDefaultValueSql("((0))");

                entity.Property(e => e.MailAddress).HasMaxLength(100);

                entity.Property(e => e.PassWord)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.EmpCodeNavigation)
                    .WithMany(p => p.User)
                    .HasForeignKey(d => d.EmpCode);
            });
        }
    }
}
