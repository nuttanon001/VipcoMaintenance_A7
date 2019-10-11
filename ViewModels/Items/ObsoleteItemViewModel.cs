using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels.Items
{
    public class ObsoleteItemViewModel: ObsoleteItem
    {
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string ObsoleteDateString => this.ObsoleteDate != null ? this.ObsoleteDate.Value.ToString("dd/MM/yyyy") : "-";
        public DateTime? RegisterDate { get; set; }
        public string RegisterDateString => this.RegisterDate != null ? this.RegisterDate.Value.ToString("dd/MM/yyyy") : "-";
        public string SerialNumber { get; set; }
        public string Lifetime { get; set; }
        public string WorkGroup { get; set; }
        public string StatusString => 
            this.Status != null ? System.Enum.GetName(typeof(StatusObsolete), this.Status) : "Unknow";
    }
}
