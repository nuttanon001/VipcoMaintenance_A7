using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.ViewModels
{
    public class HistoryMaintenanceViewModel
    {
        public string ItemCode { get; set; }
        public string ItemType { get; set; }
        public string ItemName { get; set; }
        public DateTime? RequestDate { get; set; }
        public string RequestDateString => this.RequestDate != null ? this.RequestDate.Value.ToString("dd/MM/yyyy HH:mm") : "-";
        public string RequestDateString2 { get; set; }
        public DateTime? ApplyRequireDate { get; set; }
        public string ApplyRequireDateString => this.ApplyRequireDate != null ? this.ApplyRequireDate.Value.ToString("dd/MM/yyyy HH:mm:ss") : "-";
        public DateTime? FinishDate { get; set; }
        public string FinishDateString => this.FinishDate != null ? this.FinishDate.Value.ToString("dd/MM/yyyy HH:mm") : "-";
        public string FinishDateString2 { get; set; }
        public string Description { get; set; }
    }
}
