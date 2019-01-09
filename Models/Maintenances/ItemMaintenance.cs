using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class ItemMaintenance : BaseModel
    {
        [Key]
        public int ItemMaintenanceId { get; set; }
        [Required]
        public string ItemMaintenanceNo { get; set; }
        [Required]
        public DateTime PlanStartDate { get; set; }
        [Required]
        public DateTime PlanEndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        [StringLength(10)]
        public string ActualStartDateTime { get; set; }
        public DateTime? ActualEndDate { get; set; }
        [StringLength(10)]
        public string ActualEndDateTime { get; set; }
        public StatusMaintenance? StatusMaintenance { get; set; }
        [StringLength(500)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        // FK
        // Employee
        public string MaintenanceEmp { get; set; }
        // RequireMaintenance
        public int? RequireMaintenanceId { get; set; }
        public virtual RequireMaintenance RequireMaintenance { get; set; }
        // TypeMaintenance
        public int? TypeMaintenanceId { get; set; }
        public virtual TypeMaintenance TypeMaintenance { get; set; }
        // MaintenanceHasSpare
        public virtual ICollection<RequisitionStockSp> RequisitionStockSps { get; set; }
        // WorkGroupMaintenance
        public int? WorkGroupMaintenanceId { get; set; }
        public virtual WorkGroupMaintenance WorkGroupMaintenance { get; set; }
        // ItemMainHasEmployee
        public virtual ICollection<ItemMainHasEmployee> ItemMainHasEmployees { get; set; }
    }

    public enum StatusMaintenance
    {
        TakeAction = 1,
        InProcess,
        WaitSpare,
        OutSouce,
        Complate,
        Cancel
    }
}
