using System;
using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels
{
    public class ReceiveStockSpViewModel : ReceiveStockSp
    {
        public string SparePartName { get; set; }
        public string ReceiveEmpString { get; set; }
    }
}