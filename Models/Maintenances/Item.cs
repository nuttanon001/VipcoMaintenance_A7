using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class Item : BaseModel
    {
        [Key]
        public int ItemId { get; set; }
        [StringLength(50)]
        public string ItemCode { get; set; }
        [StringLength(250)]
        public string Name { get; set; }
        [StringLength(250)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Model { get; set; }
        [StringLength(200)]
        public string Brand { get; set; }
        [StringLength(200)]
        public string Property { get; set; }
        [StringLength(200)]
        public string Property2 { get; set; }
        [StringLength(200)]
        public string Property3 { get; set; }
        public DateTime? RegisterDate { get; set; }
        public DateTime? CancelDate { get; set; }
        public ItemStatus? ItemStatus { get; set; }
        public string ItemImage { get; set; }
        // Fk
        // ItemType
        public int? ItemTypeId { get; set; }
        public virtual ItemType ItemType { get; set; }
        // Employee
        public string EmpResponsible { get; set; }
        // Branch
        public int? BranchId { get; set; }
        public virtual Branch Branch { get; set; }
        // ReqireMaintenance
        public virtual ICollection<RequireMaintenance> RequireMaintenances { get; set; }
        // GroupMis
        public string GroupMis {get;set;}
    }

    public enum ItemStatus
    {
        Use = 1,
        Repair,
        Cancel,
    }
}
