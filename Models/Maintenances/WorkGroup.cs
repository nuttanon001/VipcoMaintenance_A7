using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    /// <summary>
    /// WorkGroup for maintenance only
    /// </summary>
    public class WorkGroup:BaseModel
    {
        [Key]
        public int WorkGroupId { get; set; }
        [StringLength(150)]
        public string Name { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(200)]
        public string Remark { get; set; }
        //FK
        // ItemType
        public virtual ICollection<ItemType> ItemTypes { get; set; }
        // SparePart
        public virtual ICollection<SparePart> SpareParts { get; set; }
    }
}
