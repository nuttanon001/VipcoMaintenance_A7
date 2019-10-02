﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels.Items
{
    public class ObsoleteItemScheduleViewModel
    {
        public DateTime ObsoleteDate { get; set; }
        public List<ObsoleteItem> ObsoleteItems { get; set; } = new List<ObsoleteItem>();
    }
}
