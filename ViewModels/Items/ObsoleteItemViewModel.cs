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
    }
}
