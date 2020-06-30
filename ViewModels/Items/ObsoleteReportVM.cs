using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.ViewModels.Items
{
    public class ObsoleteReportVM
    {
        public int? No { get; set; }
        public string Name {get;set;}
        public string Description {get;set;}
        public string Brand {get;set;}
        public string Model {get;set;}
        public DateTime? RegisterDate {get;set;}
        public string ItemCode {get;set;}
        public string Property {get;set;}
        public string ObsoleteNo { get; set; }
        public DateTimeOffset? ObsoleteDate { get; set; }
        public string ObDescription { get; set; }
    }
}
