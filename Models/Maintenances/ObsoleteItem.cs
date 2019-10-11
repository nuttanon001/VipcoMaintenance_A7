using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace VipcoMaintenance.Models.Maintenances
{
    public class ObsoleteItem : BaseModel
    {
        [Key]
        public int ObsoleteItemId { get; set; }

        /// <summary>
        /// Doc no.
        /// </summary>
        [StringLength(50)]
        public string ObsoleteNo { get; set; }

        /// <summary>
        /// Cancel date
        /// </summary>
        public DateTimeOffset? ObsoleteDate { get; set; }

        /// <summary>
        /// Amount of item
        /// </summary>
        public double? FixedAsset { get; set; }

        /// <summary>
        /// Approve first part by
        /// </summary>
        [StringLength(50)]
        public string Approve1 { get; set; }

        /// <summary>
        /// Name of Approve first
        /// </summary>
        [StringLength(200)]
        public string Approve1NameThai { get; set; }

        /// <summary>
        /// Datetime of approve
        /// </summary>
        public DateTimeOffset? Approve1Date { get; set; }

        /// <summary>
        /// ForeignKey Item 
        /// </summary>
        public int? ItemId { get; set; }

        /// <summary>
        /// Object item for reference
        /// </summary>
        [JsonIgnore]
        public Item Item { get; set; }


        /// <summary>
        /// Description for cancel item
        /// </summary>
        [StringLength(500)]
        public string Description { get; set; }

        /// <summary>
        /// Request cancel itme
        /// </summary>
        [StringLength(50)]
        public string Request { get; set; }

        /// <summary>
        /// Request cancel item name
        /// </summary>
        [StringLength(200)]
        public string RequestNameThai { get; set; }


        /// <summary>
        /// Approve2 cancel item
        /// </summary>
        [StringLength(50)]
        public string Approve2 { get; set; }

        /// <summary>
        /// Approve2 cancel item name
        /// </summary>
        [StringLength(200)]
        public string Approve2NameThai { get; set; }

        /// <summary>
        /// Approve2 date
        /// </summary>
        public DateTimeOffset? Approve2Date { get; set; }

        // [JsonIgnore]
        // public ObsoleteItemHasAttach ObsoleteItemHasAttach { get; set; }


        [StringLength(500)]
        public string Remark { get; set; }

        public bool? ApproveToFix { get; set; }

        public bool? ApproveToObsolete { get; set; }

        [StringLength(50)]
        public string ComplateBy { get; set; }

        [StringLength(200)]
        public string ComplateByNameThai { get; set; }
        public StatusObsolete? Status { get; set; }

    }

    public enum StatusObsolete
    {
        Wait = 1,
        ApproveLevel1,
        ApproveLevel2,
        ApproveLevel3,
        FixOnly,
        Cancel
    }
}
