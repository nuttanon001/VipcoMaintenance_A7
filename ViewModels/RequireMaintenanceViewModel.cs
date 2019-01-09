using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels
{
    public class RequireMaintenanceViewModel:RequireMaintenance
    {
        public string ItemCode { get; set; }
        public string RequireEmpString { get; set; }
        public string ProjectCodeMasterString { get; set; }
        public string BranchString { get; set; }
        public string GroupMISString { get; set; }
        public string RequireStatusString { get; set; }
        public int? ItemMaintenanceId { get; set; }
    }
}
