using System;

namespace VipcoMaintenance.ViewModels
{
  public class HistoryMaintenanceViewModel
  {
    public string ItemCode { get; set; }
    public string ItemType { get; set; }
    public string ItemName { get; set; }
    public DateTime? RequestDate { get; set; }
    public string RequestDateString => this.RequestDate != null ? this.RequestDate.Value.ToString("dd/MM/yyyy HH:mm") : "-";
    public string RequestDateString2 { get; set; }
    public DateTime? ApplyRequireDate { get; set; }
    public string ApplyRequireDateString => this.ApplyRequireDate != null ? this.ApplyRequireDate.Value.ToString("dd/MM/yyyy HH:mm:ss") : "-";
    public DateTime? FinishDate { get; set; }
    public string FinishDateString => this.FinishDate != null ? this.FinishDate.Value.ToString("dd/MM/yyyy HH:mm") : "-";
    public string FinishDateString2 { get; set; }
    public string Description { get; set; }
    public DateTime? ActualSDate { get; set; }
    public string ActualSTime { get; set; }
    public DateTime? ActualEDate { get; set; }
    public string ActialETime { get; set; }
    public string StdTime { get; set; }
    public double StdTimeValue { get; set; }

    public string BdTime { get; set; }
    public double BdTimeValue { get; set; }
  }

  public class EmpMaintenanceVm
  {
    public string EmployeeName { get; set; }
    public string ItemCode { get; set; }
    public string ItemName { get; set; }
    public string ItemType { get; set; }
    public DateTime? SDate { get; set; }
    public DateTime? EDate { get; set; }
    public (string time, double timeValue)? StdHour { get; set; }
    public string StdHourStr => StdHour != null ? StdHour.Value.time : "0:00";
  }

  public class EmpMaintenance2Vm
  {
    public string EmpCode { get; set; }
    public string EmpName { get; set; }
  }

  public class MaintenanceHisMk2
  {
    public string ItemCode { get; set; }
    public string ItemName { get; set; }
    public string ItemType { get; set; }
    public string MainType { get; set; }
    public double? StdTime { get; set; }
    public DateTime? ReqDate { get; set; }
    public string ReqTime { get; set; }
    public DateTime? MainApply { get; set; }
    public DateTime? ActSDate { get; set; }
    public string ActSTime { get; set; }
    public DateTime? ActEDate { get; set; }
    public string ActETime { get; set; }
    public string MainDesc { get; set; }
  }
}