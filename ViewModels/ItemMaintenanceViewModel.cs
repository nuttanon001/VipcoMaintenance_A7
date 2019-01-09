using VipcoMaintenance.Models.Maintenances;

namespace VipcoMaintenance.ViewModels
{
    public class ItemMaintenanceViewModel : ItemMaintenance
    {
        public string ItemCode { get; set; }
        public string MaintenanceEmpString { get; set; }
        public string TypeMaintenanceString { get; set; }
        public string StatusMaintenanceString { get; set; }
        public string WorkGroupMaintenanceString { get; set; }
    }
}