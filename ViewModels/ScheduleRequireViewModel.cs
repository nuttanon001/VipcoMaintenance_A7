using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.ViewModels
{
    public class ScheduleRequireViewModel
    {
        public DateTime RequireDate { get; set; }
        public string RequireDateString => this.RequireDate.ToString("dd/MM/yy");
        public IDictionary<string, List<ScheduleRequireSubViewModel>> ListItem { get; set; }
        
    }
}
