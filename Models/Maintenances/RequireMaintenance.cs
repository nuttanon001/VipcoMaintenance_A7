using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class RequireMaintenance : BaseModel
    {
        [Key]
        public int RequireMaintenanceId { get; set; }
        public string RequireNo { get; set; }
        [Required]
        public DateTime RequireDate { get; set; }
        [StringLength(10)]
        public string RequireDateTime { get; set; }
        [StringLength(500)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        public RequireStatus? RequireStatus { get; set; }
        public DateTime? MaintenanceApply { get; set; }
        [StringLength(250)]
        public string MailApply { get; set; }
        // FK
        // GroupMis
        public string GroupMIS { get; set; }
        // Employee
        public string RequireEmp { get; set; }
        // Item
        public int? ItemId { get; set; }
        public virtual Item Item { get; set; }
        // Branch
        public int? BranchId { get; set; }
        public virtual Branch Branch { get; set; }
        // ItemMaintenance
        public virtual ItemMaintenance ItemMaintenance { get; set; }
        // JobNumber
        public int? ProjectCodeMasterId { get; set; }
        // RequireMaintenanceHasAttach
        public virtual ICollection<RequireMaintenanceHasAttach> RequireMaintenanceHasAttaches { get; set; }
    }

    public enum RequireStatus
    {
        Waiting = 1,
        InProcess,
        Complate,
        Cancel,
        MaintenanceResponse
    }
}
