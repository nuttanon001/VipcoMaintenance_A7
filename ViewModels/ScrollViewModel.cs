using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace VipcoMaintenance.ViewModels
{
    public class ScrollViewModel
    {
        //The Skip number
        public int? Skip { get; set; }
        //The Take number
        public int? Take { get; set; }
        public string SortField { get; set; }
        public int? SortOrder { get; set; }
        public string Filter { get; set; }
        public bool? Reload { get; set; }
        public string Where { get; set; }
        public int? WhereId { get; set; }
        public int? Where2Id { get; set; }
        public int? TotalRow { get; set; }
        public DateTime? SDate { get; set; }
        public DateTime? EDate { get; set; }
    }
}
