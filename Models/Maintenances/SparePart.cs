using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class SparePart:BaseModel
    {
        [Key]
        public int SparePartId { get; set; }
        [StringLength(50)]
        public string Code { get; set; }
        [StringLength(200)]
        public string Name { get; set; }
        [StringLength(250)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        [StringLength(200)]
        public string Model { get; set; }
        [StringLength(200)]
        public string Size { get; set; }
        [StringLength(200)]
        public string Property { get; set; }
        public string SparePartImage { get; set; }
        public double? MinStock { get; set; }
        public double? MaxStock { get; set; }
        public double? UnitPrice { get; set; }
        //FK
        // WorkGroup
        public int? WorkGroupId { get; set; }
        public virtual WorkGroup WorkGroup { get; set; }
        // MaintenanceHasSpare
        public virtual ICollection<RequisitionStockSp> RequisitionStockSps { get; set; }
        public virtual ICollection<ReceiveStockSp> ReceiveStockSps { get; set; }
        //MovementStock
        public virtual ICollection<MovementStockSp> MovementStockSps { get; set; }
    }
}
