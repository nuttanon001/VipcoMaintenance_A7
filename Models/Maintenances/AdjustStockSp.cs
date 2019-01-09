using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class AdjustStockSp:BaseModel
    {
        [Key]
        public int AdjustStockSpId { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        [Required]
        public DateTime AdjustDate { get; set; }
        [Required]
        public double Quantity { get; set; }
        //FK
        // Employee
        public string EmpCode { get; set; }
        // SparePart
        public int? SparePartId { get; set; }
        public virtual SparePart SparePart { get; set; }
        // MovementStockSp
        public int? MovementStockSpId { get; set; }
        public virtual MovementStockSp MovementStockSp { get; set; }
    }
}
