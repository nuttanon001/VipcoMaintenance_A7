using System;
using System.Collections.Generic;

namespace VipcoMaintenance.Models.Machines
{
    public partial class EmployeeGroupMis
    {
        public EmployeeGroupMis()
        {
            Employee = new HashSet<Employee>();
        }

        public string GroupMis { get; set; }
        public string GroupDesc { get; set; }
        public string Remark { get; set; }

        public virtual ICollection<Employee> Employee { get; set; }
    }
}
