using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels
{
    public class ItemViewModel:Item
    {
        public string ItemTypeString { get; set; }
        public string EmpResposibleString { get; set; }
        public string BranchString { get; set; }
        public string ItemStatusString { get; set; }
        public string GroupMisString {get;set;}
    }
}
