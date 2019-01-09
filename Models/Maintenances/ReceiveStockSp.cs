using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class ReceiveStockSp : BaseModel
    {
        [Key]
        public int ReceiveStockSpId { get; set; }
        public string PurchaseOrder { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        public double Quantity { get; set; }
        public DateTime ReceiveDate { get; set; }
        // FK
        // Employee
        public string ReceiveEmp { get; set; }
        // SparePart
        public int? SparePartId { get; set; }
        public virtual SparePart SparePart { get; set; }
        // MovementStockSp
        public int? MovementStockSpId { get; set; }
        public virtual MovementStockSp MovementStockSp { get; set; }

    }
}
