using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.ViewModels
{
    public class SqlCommandViewModel
    {
        public string SelectCommand { get; set; }
        public string FromCommand { get; set; }
        public string WhereCommand { get; set; }
        public string OrderCommand { get; set; }
        public string GroupCommand { get; set; }
        public string InsertCommand { get; set; }
        public string UpdateCommand { get; set; }
        public string ValueCommand { get; set; }
    }
}
