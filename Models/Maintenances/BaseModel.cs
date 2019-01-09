using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class BaseModel
    {
        [StringLength(50)]
        public string Creator { get; set; }
        public DateTime? CreateDate { get; set; }
        [StringLength(50)]
        public string Modifyer { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
