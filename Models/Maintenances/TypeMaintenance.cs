using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class TypeMaintenance:BaseModel
    {
        [Key]
        public int TypeMaintenanceId { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        //FK
        // ItemType
        public int? ItemTypeId { get; set; }
        public virtual ItemType ItemType { get; set; }
        // ItemMaintenance
        public virtual ICollection<ItemMaintenance> ItemMaintenances { get; set; }
    }
}
