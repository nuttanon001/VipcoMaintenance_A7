using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class RequisitionStockSp:BaseModel
    {
        [Key]
        public int RequisitionStockSpId { get; set; }
        public string PaperNo { get; set; }
        public string Remark { get; set; }
        public double Quantity { get; set; }
        public DateTime RequisitionDate { get; set; }
        // Fk
        // Employee
        public string RequisitionEmp { get; set; }
        // SparePart
        public int? SparePartId { get; set; }
        public virtual SparePart SparePart { get; set; }
        // ItemMaintenance
        public int? ItemMaintenanceId { get; set; }
        public virtual ItemMaintenance ItemMaintenance { get; set; }
        // MovementStockSp
        public int? MovementStockSpId { get; set; }
        public virtual MovementStockSp MovementStockSp { get; set; }
    }
}
