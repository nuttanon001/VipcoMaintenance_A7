using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    /// <summary>
    /// Type of item maintenance
    /// </summary>
    public class ItemType:BaseModel
    {
        [Key]
        public int ItemTypeId { get; set; }
        [StringLength(150)]
        public string Name { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        // fk
        // WorkGroup
        public int? WorkGroupId { get; set; }
        public virtual WorkGroup  WorkGroup { get; set; }
        // Item
        public virtual ICollection<Item> Items { get; set; }
    }
}
