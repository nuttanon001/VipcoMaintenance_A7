using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VipcoMaintenance.Models.Maintenances
{
    public class RequireMaintenanceHasAttach:BaseModel
    {
        [Key]
        public int RequireMaintenanceHasAttachId { get; set; }
        // FK
        // RequireMaintenance
        public int? RequireMaintenanceId { get; set; }
        public virtual RequireMaintenance RequireMaintenance { get; set; }
        // AttachFile
        public int? AttachFileId { get; set; }
    }
}
