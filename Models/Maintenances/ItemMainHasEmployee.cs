using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class ItemMainHasEmployee:BaseModel
    {
        [Key]
        public int ItemMainHasEmployeeId { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        // FK
        // ItemMaintenance
        public int? ItemMaintenanceId { get; set; }
        public virtual ItemMaintenance ItemMaintenance { get; set; }
        // Employee
        public string EmpCode { get; set; }
    }
}
