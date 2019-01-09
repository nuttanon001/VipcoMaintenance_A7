using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using VipcoMaintenance.Models.Maintenances;
namespace VipcoMaintenance.ViewModels
{
    public class ItemMainHasEmployeeViewModel:ItemMainHasEmployee
    {
        public string ItemMainEmpString { get; set; }
    }
}
