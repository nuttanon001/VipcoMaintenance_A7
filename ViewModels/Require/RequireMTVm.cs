using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels.Require
{
    public class RequireMTVm
    {
        public DateTime? RequireDate { get; set; }
        public int? ItemId { get; set; }
        public int? RequireMaintenanceId { get; set; }
        public DateTime? MaintenanceApply { get; set; }
        public RequireStatus RequireStatus { get; set; }
        public string RequireEmp { get; set; }
        public string Description { get; set; }
        // MaintenanceTable
        public int? ItemMaintenanceId { get; set; }
        public string MaintenanceNo { get; set; }
        public DateTime? PlanEndDate { get; set; }
        public string Remark { get; set; }
        // ItemTable
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string TypeName { get; set; }
        // Employee
        public string NameThai { get; set; }
        public string GroupName { get; set; }
    }
}
