using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.ViewModels
{
    public class ReturnViewModel<Entity>
    {
        public List<Entity> Entities { get; set; } = new List<Entity>();
        public int? TotalRow { get; set; }
    }
}
