using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class MovementStockSp:BaseModel
    {
        [Key]
        public int MovementStockSpId { get; set; }
        [Required]
        public DateTime MovementDate { get; set; }
        [Required]
        public double Quantity { get; set; }
        [Required]
        public MovementStatus MovementStatus { get; set; }
        public double MultiplyStock =>
            (MovementStatus == MovementStatus.ReceiveStock ? 1 :
            (MovementStatus == MovementStatus.AdjustIncrement ? 1 :
            (MovementStatus == MovementStatus.AdjustDecrement ? -1 :
            (MovementStatus == MovementStatus.RequisitionStock ? -1 : 0))));
        // FK
        // SparePart
        public int? SparePartId { get; set; }
        public virtual SparePart SparePart { get; set; }
        // ReceiveStockSp
        public virtual ReceiveStockSp ReceiveStockSp { get; set; }
        // RequisitionStockSp
        public virtual RequisitionStockSp RequisitionStockSp { get; set; }
        // AdjsutStockSp
        public virtual AdjustStockSp AdjustStockSp { get; set; }
    }

    public enum MovementStatus
    {
        ReceiveStock = 1,
        RequisitionStock,
        AdjustIncrement,
        AdjustDecrement,
        Cancel
    }
}
