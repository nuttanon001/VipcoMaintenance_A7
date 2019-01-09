using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace VipcoMaintenance.Models.Maintenances
{
    public class WorkGroupMaintenance:BaseModel
    {
        [Key]
        public int WorkGroupMaintenanceId { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        // FK
        //ItemMaintenance
        public virtual ICollection<ItemMaintenance> ItemMaintenances { get; set; }

    }
}
