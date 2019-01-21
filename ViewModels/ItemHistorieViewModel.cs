using System;

namespace VipcoMaintenance.ViewModels
{
    public class ItemHistorieViewModel
    {
        public string Fail { get; set; }
        public string Fix { get; set; }
        public DateTime? Date { get; set; }
        public string DateString => this.Date == null ? "-" : this.Date.Value.ToString("dd/MM/yy");
        public int? ItemMaintenanceId { get; set; }
        public string Remark { get; set; }
    }
}