using System;
using System.Collections.Generic;

namespace VipcoMaintenance.Models.Machines
{
    public partial class User
    {
        public int UserId { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Creator { get; set; }
        public string EmpCode { get; set; }
        public string MailAddress { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string Modifyer { get; set; }
        public string PassWord { get; set; }
        public string UserName { get; set; }
        public int LevelUser { get; set; }

        public virtual Employee EmpCodeNavigation { get; set; }
    }
}
