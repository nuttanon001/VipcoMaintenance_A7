using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace VipcoMaintenance.Models.Maintenances
{
    public class Branch:BaseModel
    {
        [Key]
        [Column(Order = 0)]
        public int BranchId { get; set; }
        [Column(Order = 1)]
        [StringLength(50)]
        public string Name { get; set; }
        [Column(Order = 2)]
        [StringLength(250)]
        public string Address { get; set; }

        //Fk
        //Item
        public virtual ICollection<Item> Items { get; set; }
        // RequireMaintenance
        public virtual ICollection<RequireMaintenance> RequireMaintenances { get; set; }
    }
}
