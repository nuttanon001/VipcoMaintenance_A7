using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.ViewModels.Require
{
    public class RequireGroupVm
    {
        public DateTime RequireDate { get; set; }
        public List<RequireMTVm> Tools { get; set; } = new List<RequireMTVm>();
        public List<RequireMTVm> Machines { get; set; } = new List<RequireMTVm>();
        public List<RequireMTVm> Others { get; set; } = new List<RequireMTVm>();

    }
}
