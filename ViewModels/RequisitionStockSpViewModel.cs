using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels
{
    public class RequisitionStockSpViewModel: RequisitionStockSp
    {
        public string SparePartName { get; set; }
        public string RequisitionEmpString { get; set; }
        public double? UnitPrice { get; set; }
    }
}
