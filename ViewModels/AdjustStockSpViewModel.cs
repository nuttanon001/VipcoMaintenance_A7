﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels
{
    public class AdjustStockSpViewModel:AdjustStockSp
    {
        public string SparePartName { get; set; }
        public string AdjustEmpString { get; set; }
    }
}
