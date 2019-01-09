using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace VipcoMaintenance.ViewModels
{
    public class ItemHistoryOptionViewModel
    {
        public int ItemId { get; set; }
        public DateTime? SDate { get; set; }
        public DateTime? EDate { get; set; }
    }
}
