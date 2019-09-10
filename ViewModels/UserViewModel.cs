using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Machines;

namespace VipcoMaintenance.ViewModels
{
    public class UserViewModel:User
    {
        public string NameThai { get; set; }
        public string Token { get; set; }
        public int? SubLevel { get; set; }
        public DateTime? ValidTo { get; set; }
    }
}
