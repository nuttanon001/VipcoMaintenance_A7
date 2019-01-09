using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels
{
    public class ScheduleRequireSubViewModel
    {
        public int? RequireMaintenanceId { get; set; }
        public DateTime? MaintenanceApply {get;set;}
        public string ItemCodeName  {get;set;}
        public string RequireEmpString  {get;set;}
        public RequireStatus? RequireStatus  {get;set;}
        public int? ItemMaintenanceId  {get;set;}
    }
}
