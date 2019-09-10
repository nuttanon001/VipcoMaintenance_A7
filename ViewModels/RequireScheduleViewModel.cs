using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.ViewModels
{
    public class RequireScheduleViewModel
    {
        public DateTime? ScheduleDate { get; set; }
        public List<RequireMaintenanceViewModel> Tool { get; set; } = new List<RequireMaintenanceViewModel>();
        public List<RequireMaintenanceViewModel> Machine { get; set; } = new List<RequireMaintenanceViewModel>();
        public List<RequireMaintenanceViewModel> Other { get; set; } = new List<RequireMaintenanceViewModel>();

    }
}
