using System;
using System.Collections.Generic;

namespace VipcoMaintenance.Models.Machines
{
    public partial class AttachFile
    {
        public int AttachFileId { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Creator { get; set; }
        public string FileAddress { get; set; }
        public string FileName { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string Modifyer { get; set; }
    }
}
