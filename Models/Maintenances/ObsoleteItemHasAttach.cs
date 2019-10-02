﻿using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

using VipcoMaintenance.Models.Machines;
using Newtonsoft.Json;

namespace VipcoMaintenance.Models.Maintenances
{
    public class ObsoleteItemHasAttach:BaseModel
    {
        [Key]
        public int ObsoleteItemHasAttachId { get; set; }
        public int? ObsoleteItemlId { get; set; }
        [JsonIgnore]
        public ObsoleteItem ItemHasCancel { get; set; }
        public int? AttachFileId { get; set; }
        [JsonIgnore]
        public AttachFile AttachFile { get; set; }
        public FileType? FileType { get; set; }
    }

    public enum FileType
    {
        Image = 1,
        Doc,
        Pdf
    }
}
