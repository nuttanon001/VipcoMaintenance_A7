using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.ViewModels
{
    public class ItemMainV2ViewModel
    {
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public DateTime? RequireDate { get; set; }
        public string RequireDateString => this.RequireDate == null ? "-" : this.RequireDate.Value.ToString("dd/MM/yy");
        public string RequireEmpCode { get; set; }
        public string RequireEmpName { get; set; }
        public string MainGroupName { get; set; }
        public string MainTypeName { get; set; }
        public int? ItemMaintenanceId { get; set; }

    }
}
