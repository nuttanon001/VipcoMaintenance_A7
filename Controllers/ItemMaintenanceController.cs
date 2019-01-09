using AutoMapper;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VipcoMaintenance.Helper;
using VipcoMaintenance.Models.Machines;
using VipcoMaintenance.Models.Maintenances;
using VipcoMaintenance.Services;
using VipcoMaintenance.Services.EmailServices;
using VipcoMaintenance.ViewModels;

namespace VipcoMaintenance.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ItemMaintenanceController : GenericController<ItemMaintenance>
    {
        private readonly IRepositoryMaintenanceMk2<RequisitionStockSp> repositoryRequisition;
        private readonly IRepositoryMaintenanceMk2<MovementStockSp> repositoryMovement;
        private readonly IRepositoryMaintenanceMk2<ItemMainHasEmployee> repositoryItemMainEmp;
        private readonly IRepositoryMaintenanceMk2<RequireMaintenance> repositoryRequire;
        private readonly IRepositoryMachineMk2<ProjectCodeMaster> repositoryProject;
        private readonly IRepositoryMachineMk2<Employee> repositoryEmp;
        private readonly IRepositoryMachineMk2<EmployeeGroupMis> repositoryEmpGroup;
        private readonly IHostingEnvironment hosting;
        private readonly IEmailSender emailSender;
        //Helper

        // Controller
        public ItemMaintenanceController(
            IRepositoryMaintenanceMk2<ItemMaintenance> repo,
            IRepositoryMaintenanceMk2<RequisitionStockSp> repoRequistion,
            IRepositoryMaintenanceMk2<MovementStockSp> repoMovement,
            IRepositoryMaintenanceMk2<ItemMainHasEmployee> repoItemMainEmp,
            IRepositoryMaintenanceMk2<RequireMaintenance> repoRequire,
            IRepositoryMachineMk2<ProjectCodeMaster> repoProject,
            IRepositoryMachineMk2<Employee> repoEmp,
            IRepositoryMachineMk2<EmployeeGroupMis> repoEmpGroup,
            IEmailSender email,
            IHostingEnvironment hosting,
            IMapper map) : base(repo, map)
        {
            // Repositiory
            this.repositoryItemMainEmp = repoItemMainEmp;
            this.repositoryMovement = repoMovement;
            this.repositoryRequisition = repoRequistion;
            this.repositoryProject = repoProject;
            this.repositoryRequire = repoRequire;
            this.repositoryEmp = repoEmp;
            this.repositoryEmpGroup = repoEmpGroup;
            // Helpper
            this.emailSender = email;
            // Host
            this.hosting = hosting;
        }

        /// <summary>
        /// Change status of require maintenance and send email if not yet send.
        /// </summary>
        /// <param name="RequireMaintenanceId"></param>
        /// <param name="ByEmp"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        private async Task<bool> UpdateRequireMaintenance(int RequireMaintenanceId,
            string ByEmp, RequireStatus status = RequireStatus.InProcess)
        {
            var RequireData = await this.repositoryRequire.GetAsync(RequireMaintenanceId);
            if (RequireData != null)
            {
                var SendMail = RequireData.MaintenanceApply == null;

                RequireData.MaintenanceApply = RequireData.MaintenanceApply == null ? DateTime.Now : RequireData.MaintenanceApply;
                RequireData.RequireStatus = status;
                RequireData.ModifyDate = DateTime.Now;
                RequireData.Modifyer = ByEmp;

                var Complate = await this.repositoryRequire.UpdateAsync(RequireData, RequireData.RequireMaintenanceId);
                if (SendMail && Complate != null)
                {
                    var EmpName = (await this.repositoryEmp.GetAsync(Complate.RequireEmp)).NameThai ?? "ไม่ระบุ";

                    if (this.emailSender.IsValidEmail(Complate.MailApply))
                    {
                        var BodyMessage = "<body style=font-size:11pt;font-family:Tahoma>" +
                                        "<h4 style='color:steelblue;'>เมล์ฉบับนี้เป็นแจ้งเตือนจากระบบงาน VIPCO Maintenance SYSTEM</h4>" +
                                        $"เรียน คุณ{EmpName}" +
                                        $"<p>เรื่อง การเปิดคำขอซ่อมบำรุงใบงานเลขที่ {Complate.RequireNo} </p>" +
                                        $"<p style='color:blue;'><b>ณ.ขณะนี้ได้รับการตอบสนอง</b></p>" +
                                        $"<p>จากทางหน่วยงานซ่อมบำรุง โปรดรอการดำเนินการจากทางหน่วยงาน</p>" +
                                        $"<p>\"คุณ{EmpName}\" " +
                                        $"สามารถเข้าไปตรวจติดตามข้อมูลได้ <a href='http://{Request.Host}/maintenance/maintenance/link-mail/{Complate.RequireMaintenanceId}'>ที่นี้</a> </p>" +
                                        "<span style='color:steelblue;'>This mail auto generated by VIPCO Maintenance SYSTEM. Do not reply this email.</span>" +
                                      "</body>";

                        var mail = new EmailViewModel()
                        {
                            MailFrom = Complate.MailApply,
                            MailTos = new List<string> { Complate.MailApply },
                            Message = BodyMessage,
                            NameFrom = EmpName,
                            Subject = "Notification mail from VIPCO Maintenance SYSTEM."
                        };

                        return await this.emailSender.SendMail(mail);
                    }
                }
            }
            
             return false;
        }

        /// <summary>
        /// Send mail to employee who require maintenance.
        /// </summary>
        /// <param name="RequireMaintenanceId"></param>
        /// <returns></returns>
        private async Task<bool> MaintenanceComplateEmail(int RequireMaintenanceId)
        {
            var RequireData = await this.repositoryRequire.GetAsync(RequireMaintenanceId);
            if (RequireData != null)
            {
                var EmpName = (await this.repositoryEmp.GetAsync(RequireData.RequireEmp)).NameThai ?? "ไม่ระบุ";

                if (this.emailSender.IsValidEmail(RequireData.MailApply))
                {
                    var BodyMessage = "<body style=font-size:11pt;font-family:Tahoma>" +
                                    "<h4 style='color:steelblue;'>เมล์ฉบับนี้เป็นแจ้งเตือนจากระบบงาน VIPCO Maintenance SYSTEM</h4>" +
                                    $"เรียน คุณ{EmpName}" +
                                    $"<p>เรื่อง การเปิดคำขอซ่อมบำรุงใบงานเลขที่ {RequireData.RequireNo} </p>" +
                                    $"<p style='color:red;'><b>ณ.ขณะนี้ได้รับการซ่อมบำรุงแล้วเสร็จ</b></p>" +
                                    $"<p>จากทางหน่วยงานซ่อมบำรุง โปรดเข้ารับอุปกรณ์คืนจากทางหน่วยงาน หากได้ทำการส่งเครื่องให้แก่หน่วยงาน</p>" +
                                    $"<p>\"คุณ{EmpName}\" " +
                                    $"สามารถเข้าไปตรวจสอบข้อมูล ผู้ซ่อมหรือค่าใช้จ่ายได้ <a href='http://{Request.Host}/maintenance/maintenance/link-mail/{RequireData.RequireMaintenanceId}'>ที่นี้</a> </p>" +
                                    "<span style='color:steelblue;'>This mail auto generated by VIPCO Maintenance SYSTEM. Do not reply this email.</span>" +
                                    "</body>";

                    var mail = new EmailViewModel()
                    {
                        MailFrom = RequireData.MailApply,
                        MailTos = new List<string> { RequireData.MailApply },
                        Message = BodyMessage,
                        NameFrom = EmpName,
                        Subject = "Notification mail from VIPCO Maintenance SYSTEM."
                    };

                    return await this.emailSender.SendMail(mail);
                }
            }

            return false;
        }

        private StatusMaintenance ChangeStatus(ItemMaintenance itemMaintenance)
        {
            if (itemMaintenance != null)
            {
                if (itemMaintenance.StatusMaintenance == StatusMaintenance.TakeAction ||
                    itemMaintenance.StatusMaintenance == StatusMaintenance.InProcess)
                {
                    // Actual start is set
                    if (itemMaintenance.ActualStartDate.HasValue)
                    {
                        // Actual end is set
                        if (itemMaintenance.ActualEndDate.HasValue)
                            return StatusMaintenance.Complate;
                        else // Actual end is not set
                            return StatusMaintenance.InProcess;
                    }
                    else
                        return StatusMaintenance.TakeAction;
                }
            }
            else
                return StatusMaintenance.TakeAction;

            return itemMaintenance.StatusMaintenance.Value;
        }

        // GET: api/ItemMaintenance/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasItem = await this.repository.GetFirstOrDefaultAsync(
                x => x, x => x.ItemMaintenanceId == key, null,
                x => x.Include(z => z.TypeMaintenance).Include(z => z.WorkGroupMaintenance));
            if (HasItem != null)
            {
                var MapItem = this.mapper.Map<ItemMaintenance, ItemMaintenanceViewModel>(HasItem);
                return new JsonResult(MapItem, this.DefaultJsonSettings);
            }
            return BadRequest();
        }

        // GET: api/ItemMaintenance/ItemMaintenanceReport
        [HttpGet("ItemMaintenanceReport")]
        public async Task<IActionResult> ItemMaintenanceReport(int key)
        {
            if (key > 0)
            {
                var ItemMain = await this.repository.GetFirstOrDefaultAsync(
                    x => x, x => x.ItemMaintenanceId == key, null,
                    z => z.Include(x => x.ItemMainHasEmployees)
                        .Include(x => x.RequireMaintenance.Item)
                        .Include(x => x.RequireMaintenance.Branch)
                        .Include(x => x.WorkGroupMaintenance)
                        .Include(x => x.RequisitionStockSps)
                            .ThenInclude(x => x.SparePart));

                if (ItemMain != null)
                {
                    var WorkGroupName = (await this.repositoryEmpGroup.GetAsync(ItemMain.RequireMaintenance.GroupMIS))?.GroupDesc ?? "";
                    var RequireMaintenBy = (await this.repositoryEmp.GetAsync(ItemMain.RequireMaintenance.RequireEmp))?.NameThai ?? "";
                    // Get ReportOverTimeMaster
                    var ReportItemMaintenance = new
                    {
                        RequireMaintenanceNo = ItemMain.RequireMaintenance.RequireNo,
                        RequireDate = ItemMain?.RequireMaintenance?.RequireDate.ToString("dd/MM/yyyy  HH:mm น."),
                        BranchName = ItemMain?.RequireMaintenance?.Branch?.Name ?? "-",
                        RequireMaintenBy,
                        WorkGroupName,
                        GroupMainten = ItemMain?.WorkGroupMaintenance.Name,
                        ItemName = $"{ItemMain?.RequireMaintenance?.Item?.ItemCode ?? "-" } / {ItemMain?.RequireMaintenance?.Item?.Name ?? "-" }",
                        DescRequireMainten = ItemMain?.RequireMaintenance.Description ?? "-",
                        // =========================================================== //
                        DescMainten = ItemMain.Description,
                        StartActual = ItemMain.ActualStartDate != null ? ItemMain.ActualStartDate.Value.ToString("dd/MM/yyyy  HH:mm น.") : "",
                        EndActual = ItemMain.ActualEndDate != null ? ItemMain.ActualEndDate.Value.ToString("dd/MM/yyyy  HH:mm น.") : "",
                        // Lists
                        MaintenBy = new[] { new { EmpCode = "", NameThai = "" } }.ToList(),
                        SparePartes = new[] { new { SpareName = "", Quantity = 0D } }.ToList(),
                    };

                    foreach (var MainBy in ItemMain.ItemMainHasEmployees)
                    {
                        var EmpString = (await this.repositoryEmp.GetAsync(MainBy.EmpCode)).NameThai;
                        ReportItemMaintenance.MaintenBy.Add(new
                        {
                            MainBy.EmpCode,
                            NameThai = EmpString
                        });
                    }

                    foreach (var Requisition in ItemMain.RequisitionStockSps)
                    {
                        ReportItemMaintenance.SparePartes.Add(new
                        {
                            SpareName = Requisition?.SparePart?.Name ?? "-",
                            Requisition.Quantity
                        });
                    }

                    // Get ReportOverTimeDetail
                    return new JsonResult(ReportItemMaintenance, this.DefaultJsonSettings);
                }
            }
            return BadRequest();
        }

        // POST: api/ItemMaintenance/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.Split(null);

            var predicate = PredicateBuilder.False<ItemMaintenance>();

            foreach (string temp in filters)
            {
                string keyword = temp;
                predicate = predicate.Or(x => x.Description.ToLower().Contains(keyword) ||
                                            x.ItemMaintenanceNo.ToLower().Contains(keyword) ||
                                            x.Remark.ToLower().Contains(keyword) ||
                                            x.RequireMaintenance.Item.Name.ToLower().Contains(keyword) ||
                                            x.RequireMaintenance.Item.ItemCode.ToLower().Contains(keyword) ||
                                            x.TypeMaintenance.Name.ToLower().Contains(keyword) ||
                                            x.TypeMaintenance.Description.ToLower().Contains(keyword));
            }

            if (!string.IsNullOrEmpty(Scroll.Where))
                predicate = predicate.And(x => x.Creator == Scroll.Where);

            if (Scroll.WhereId.HasValue)
                predicate = predicate.And(x => x.RequireMaintenance.Item.ItemTypeId == Scroll.WhereId);

            //Order by
            Func<IQueryable<ItemMaintenance>, IOrderedQueryable<ItemMaintenance>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "ItemCode":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.RequireMaintenance.Item.ItemCode);
                    else
                        order = o => o.OrderBy(x => x.RequireMaintenance.Item.ItemCode);
                    break;

                case "TypeMaintenanceString":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.TypeMaintenance.Name);
                    else
                        order = o => o.OrderBy(x => x.TypeMaintenance.Name);
                    break;

                case "StatusMaintenanceString":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.StatusMaintenance);
                    else
                        order = o => o.OrderBy(x => x.StatusMaintenance);
                    break;

                default:
                    order = o => o.OrderByDescending(x => x.CreateDate);
                    break;
            }

            var QueryData = await this.repository.GetToListAsync(
                                    selector: selected => selected,  // Selected
                                    predicate: predicate, // Where
                                    orderBy: order, // Order
                                    include: x => x.Include(z => z.RequireMaintenance.Item)
                                                   .Include(z => z.WorkGroupMaintenance)
                                                   .Include(z => z.TypeMaintenance), // Include
                                    skip: Scroll.Skip ?? 0, // Skip
                                    take: Scroll.Take ?? 50); // Take

            // Get TotalRow
            Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);

            var mapDatas = new List<ItemMaintenanceViewModel>();
            foreach (var item in QueryData)
            {
                var MapItem = this.mapper.Map<ItemMaintenance, ItemMaintenanceViewModel>(item);
                mapDatas.Add(MapItem);
            }

            return new JsonResult(new ScrollDataViewModel<ItemMaintenanceViewModel>(Scroll, mapDatas), this.DefaultJsonSettings);
        }

        // POST: api/ItemMaintenance/
        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] ItemMaintenance record)
        {
            // Set date for CrateDate Entity
            if (record == null)
                return BadRequest();

            record.CreateDate = DateTime.Now;
            record.StatusMaintenance = this.ChangeStatus(record);
            // +7 Hour
            record = this.helper.AddHourMethod(record);
            var RunNumber = (await this.repository.GetLengthWithAsync(x => x.CreateDate.Value.Year == record.CreateDate.Value.Year)) + 1;
            record.ItemMaintenanceNo = $"M/{record.CreateDate.Value.ToString("yy")}-{RunNumber.ToString("0000")}";
            // Actual Start DateTime
            if (!string.IsNullOrEmpty(record.ActualStartDateTime) && record.ActualStartDate != null)
            {
                if (DateTime.TryParseExact(record.ActualStartDateTime, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dt))
                    record.ActualStartDate = new DateTime(record.ActualStartDate.Value.Year, record.ActualStartDate.Value.Month, record.ActualStartDate.Value.Day, dt.Hour, dt.Minute, 0);
            }
            // Actual End DateTime
            if (!string.IsNullOrEmpty(record.ActualEndDateTime) && record.ActualEndDate != null)
            {
                if (DateTime.TryParseExact(record.ActualEndDateTime, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dt))
                    record.ActualEndDate = new DateTime(record.ActualEndDate.Value.Year, record.ActualEndDate.Value.Month, record.ActualEndDate.Value.Day, dt.Hour, dt.Minute, 0);
            }

            // Set ItemMainHasEmployees
            if (record.ItemMainHasEmployees != null)
            {
                foreach (var item in record.ItemMainHasEmployees)
                {
                    if (item == null)
                        continue;

                    item.CreateDate = record.CreateDate;
                    item.Creator = record.Creator;
                }
            }
            // Set RequisitionStockSps
            if (record.RequisitionStockSps != null)
            {
                foreach (var item in record.RequisitionStockSps)
                {
                    if (item == null)
                        continue;

                    item.CreateDate = record.CreateDate;
                    item.Creator = record.Creator;
                    item.RequisitionEmp = record.MaintenanceEmp;
                    item.PaperNo = record.ItemMaintenanceNo;

                    if (item.MovementStockSp == null)
                    {
                        item.MovementStockSp = new MovementStockSp()
                        {
                            CreateDate = item.CreateDate,
                            Creator = item.Creator,
                            MovementDate = item.RequisitionDate,
                            MovementStatus = MovementStatus.ReceiveStock,
                            Quantity = item.Quantity,
                            SparePartId = item.SparePartId,
                        };
                    }
                }
            }

            if (await this.repository.AddAsync(record) == null)
                return BadRequest();

            // Update Status RequireMaintenance
            RequireStatus status = record.StatusMaintenance == StatusMaintenance.Cancel ? RequireStatus.Waiting :
                (record.StatusMaintenance == StatusMaintenance.Complate ? RequireStatus.Complate : RequireStatus.InProcess);
            // Update Status RequireMaintenance
            await this.UpdateRequireMaintenance(record.RequireMaintenanceId.Value, record.Creator, status);

            if (record.StatusMaintenance == StatusMaintenance.Complate &&
                record.RequireMaintenanceId != null)
                await this.MaintenanceComplateEmail(record.RequireMaintenanceId.Value);

            if (record.RequireMaintenance != null)
                record.RequireMaintenance = null;
            if (record.ItemMainHasEmployees != null)
                record.ItemMainHasEmployees = null;
            if (record.RequisitionStockSps != null)
                record.RequisitionStockSps = null;

            return new JsonResult(record, this.DefaultJsonSettings);
        }

        // POST: api/ItemMaintenance/Schedule
        [HttpPost("Schedule")]
        public async Task<IActionResult> Schedule([FromBody] OptionItemMaintananceSchedule Schedule)
        {
            var message = "Data not found.";
            try
            {
                Expression<Func<ItemMaintenance, bool>> expression = x =>
                                  x.PlanStartDate != null &&
                                  x.PlanEndDate != null &&
                                  x.StatusMaintenance != StatusMaintenance.Cancel;
                int TotalRow;

                if (Schedule != null)
                {
                    // Option Filter
                    if (!string.IsNullOrEmpty(Schedule.Filter))
                    {
                        var filters = string.IsNullOrEmpty(Schedule.Filter) ? new string[] { "" }
                                   : Schedule.Filter.ToLower().Split(null);
                        foreach (var keyword in filters)
                        {
                            expression = expression.And(x => x.Description.ToLower().Contains(keyword) ||
                                                             x.Remark.ToLower().Contains(keyword) ||
                                                             x.ItemMaintenanceNo.ToLower().Contains(keyword) ||
                                                             x.TypeMaintenance.Name.ToLower().Contains(keyword) ||
                                                             x.WorkGroupMaintenance.Name.ToLower().Contains(keyword) ||
                                                             x.RequireMaintenance.Item.ItemCode.ToLower().Contains(keyword) ||
                                                             x.RequireMaintenance.Item.Name.ToLower().Contains(keyword));
                        }
                    }
                    //Order by
                    Func<IQueryable<ItemMaintenance>, IOrderedQueryable<ItemMaintenance>> order;
                    // Option Mode
                    if (Schedule.Mode.HasValue)
                    {
                        if (Schedule.Mode == 1)
                            order = o => o.OrderByDescending(x => x.PlanStartDate);
                        else
                        {
                            order = o => o.OrderBy(x => x.PlanStartDate);
                            expression = expression.And(x => x.StatusMaintenance == StatusMaintenance.InProcess ||
                                                             x.StatusMaintenance == StatusMaintenance.TakeAction);
                        }
                    }
                    // Option ProjectMasterId
                    if (Schedule.ProjectMasterId.HasValue)
                        expression = expression.And(x => x.RequireMaintenance.ProjectCodeMasterId == Schedule.ProjectMasterId);
                    // Option Create
                    if (!string.IsNullOrEmpty(Schedule.Creator))
                        expression = expression.And(x => x.RequireMaintenance.RequireEmp == Schedule.Creator);
                    // Option ItemMaintenance
                    if (Schedule.ItemMaintenanceId.HasValue)
                        expression = expression.And(x => x.ItemMaintenanceId == Schedule.ItemMaintenanceId);
                    // Option RequireMaintenance
                    if (Schedule.RequireMaintenanceId.HasValue)
                        expression = expression.And(x => x.RequireMaintenanceId == Schedule.RequireMaintenanceId);
                    // Option WorkGroupMaintenance
                    if (Schedule.GroupMaintenanceId.HasValue)
                        expression = expression.And(x => x.WorkGroupMaintenanceId == Schedule.GroupMaintenanceId);
                    // Option TypeMaintenance
                    if (Schedule.TypeMaintenanceId.HasValue)
                        expression = expression.And(x => x.TypeMaintenanceId == Schedule.TypeMaintenanceId);

                    TotalRow = await this.repository.GetLengthWithAsync(expression);
                }
                else
                    TotalRow = await this.repository.GetLengthWithAsync();

                var GetData = await this.repository.GetToListAsync(
                          x => x, expression, null,
                          z => z.Include(x => x.RequireMaintenance.Item)
                                .Include(x => x.TypeMaintenance)
                                .Include(x => x.WorkGroupMaintenance),
                          Schedule.Skip ?? 0, Schedule.Take ?? 20);

                if (GetData.Any())
                {
                    IDictionary<string, int> ColumnGroupTop = new Dictionary<string, int>();
                    IDictionary<DateTime, string> ColumnGroupBtm = new Dictionary<DateTime, string>();
                    List<string> ColumnsAll = new List<string>();
                    // PlanDate
                    List<DateTime?> ListDate = new List<DateTime?>()
                    {
                        //START Date
                        GetData.Min(x => x.PlanStartDate),
                        GetData.Min(x => x.ActualStartDate) ?? null,
                        GetData.Min(x => x.RequireMaintenance.MaintenanceApply) ?? null,
                        //END Date
                        GetData.Max(x => x.PlanEndDate),
                        GetData.Max(x => x.ActualEndDate) ?? null,
                        GetData.Max(x => x.RequireMaintenance.MaintenanceApply) ?? null,
                    };

                    DateTime? MinDate = ListDate.Min();
                    DateTime? MaxDate = ListDate.Max();

                    if (MinDate == null && MaxDate == null)
                        return NotFound(new { Error = "Data not found" });

                    int countCol = 1;
                    // add Date to max
                    MaxDate = MaxDate.Value.AddDays(2);
                    MinDate = MinDate.Value.AddDays(-2);

                    // If Range of date below then 15 day add more
                    var RangeDay = (MaxDate.Value - MinDate.Value).Days;
                    if (RangeDay < 15)
                    {
                        MaxDate = MaxDate.Value.AddDays((15 - RangeDay) / 2);
                        MinDate = MinDate.Value.AddDays((((15 - RangeDay) / 2) * -1));
                    }

                    // EachDay
                    var EachDate = new Helper.LoopEachDate();
                    // Foreach Date
                    foreach (DateTime day in EachDate.EachDate(MinDate.Value, MaxDate.Value))
                    {
                        // Get Month
                        if (ColumnGroupTop.Any(x => x.Key == day.ToString("MMMM")))
                            ColumnGroupTop[day.ToString("MMMM")] += 1;
                        else
                            ColumnGroupTop.Add(day.ToString("MMMM"), 1);

                        ColumnGroupBtm.Add(day.Date, $"Col{countCol.ToString("00")}");
                        countCol++;
                    }

                    var DataTable = new List<IDictionary<String, Object>>();
                    // OrderBy(x => x.Machine.TypeMachineId).ThenBy(x => x.Machine.MachineCode)
                    foreach (var Data in GetData.OrderBy(x => x.PlanStartDate).ThenBy(x => x.PlanEndDate))
                    {
                        IDictionary<String, Object> rowData = new ExpandoObject();
                        var Progress = Data.StatusMaintenance != null ? System.Enum.GetName(typeof(StatusMaintenance), Data.StatusMaintenance) : "NoAction";
                        var ProjectMaster = "NoData";
                        if (Data?.RequireMaintenance?.ProjectCodeMasterId != null)
                        {
                            var ProjectData = await this.repositoryProject.
                                        GetAsync(Data.RequireMaintenance.ProjectCodeMasterId ?? 0);
                            ProjectMaster = ProjectData != null ? $"{ProjectData.ProjectCode}/{ProjectData.ProjectName}" : "-";
                        }

                        // add column time
                        rowData.Add("ProjectMaster", ProjectMaster);
                        rowData.Add("GroupMaintenance", $"{(Data?.WorkGroupMaintenance?.Name ?? "-")}/{(Data?.WorkGroupMaintenance?.Description ?? "-")}");
                        rowData.Add("Item", (Data.RequireMaintenance == null ? "" : $"{Data.RequireMaintenance.Item.ItemCode}/{Data.RequireMaintenance.Item.Name}"));
                        rowData.Add("Progress", Progress);
                        rowData.Add("ItemMainStatus", Data.StatusMaintenance);
                        rowData.Add("ItemMaintenanceId", Data.ItemMaintenanceId);
                        // Add new
                        if (Data.RequireMaintenance.MaintenanceApply.HasValue)
                        {
                            if (ColumnGroupBtm.Any(x => x.Key == Data.RequireMaintenance.MaintenanceApply.Value.Date))
                                rowData.Add("Response", ColumnGroupBtm.FirstOrDefault(x => x.Key == Data.RequireMaintenance.MaintenanceApply.Value.Date).Value);
                        }
                        // End new

                        // Data is 1:Plan,2:Actual,3:PlanAndActual
                        // For Plan1
                        if (Data.PlanStartDate != null && Data.PlanEndDate != null)
                        {
                            // If Same Date can't loop
                            if (Data.PlanStartDate.Date == Data.PlanEndDate.Date)
                            {
                                if (ColumnGroupBtm.Any(x => x.Key == Data.PlanStartDate.Date))
                                    rowData.Add(ColumnGroupBtm.FirstOrDefault(x => x.Key == Data.PlanStartDate.Date).Value, 1);
                            }
                            else
                            {
                                foreach (DateTime day in EachDate.EachDate(Data.PlanStartDate, Data.PlanEndDate))
                                {
                                    if (ColumnGroupBtm.Any(x => x.Key == day.Date))
                                        rowData.Add(ColumnGroupBtm.FirstOrDefault(x => x.Key == day.Date).Value, 1);
                                }
                            }
                        }

                        //For Actual
                        if (Data.ActualStartDate != null)
                        {
                            var EndDate = Data.ActualEndDate ?? (MaxDate > DateTime.Today ? DateTime.Today : MaxDate);
                            if (Data.ActualStartDate.Value.Date > EndDate.Value.Date)
                                EndDate = Data.ActualStartDate;
                            // If Same Date can't loop
                            if (Data.ActualStartDate.Value.Date == EndDate.Value.Date)
                            {
                                if (ColumnGroupBtm.Any(x => x.Key == Data.ActualStartDate.Value.Date))
                                {
                                    var Col = ColumnGroupBtm.FirstOrDefault(x => x.Key == Data.ActualStartDate.Value.Date);
                                    // if Have Plan change value to 3
                                    if (rowData.Keys.Any(x => x == Col.Value))
                                        rowData[Col.Value] = 3;
                                    else // else Don't have plan value is 2
                                        rowData.Add(Col.Value, 2);
                                }
                            }
                            else
                            {
                                foreach (DateTime day in EachDate.EachDate(Data.ActualStartDate.Value, EndDate.Value))
                                {
                                    if (ColumnGroupBtm.Any(x => x.Key == day.Date))
                                    {
                                        var Col = ColumnGroupBtm.FirstOrDefault(x => x.Key == day.Date);

                                        // if Have Plan change value to 3
                                        if (rowData.Keys.Any(x => x == Col.Value))
                                            rowData[Col.Value] = 3;
                                        else // else Don't have plan value is 2
                                            rowData.Add(Col.Value, 2);
                                    }
                                }
                            }
                        }

                        DataTable.Add(rowData);
                    }

                    if (DataTable.Any())
                        ColumnGroupBtm.OrderBy(x => x.Key.Date).Select(x => x.Value)
                            .ToList().ForEach(item => ColumnsAll.Add(item));

                    return new JsonResult(new
                    {
                        TotalRow,
                        ColumnsTop = ColumnGroupTop.Select(x => new
                        {
                            Name = x.Key,
                            x.Value
                        }),
                        ColumnsLow = ColumnGroupBtm.OrderBy(x => x.Key.Date).Select(x => x.Key.Day),
                        ColumnsAll,
                        DataTable
                    }, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                message = $"Has error with message has {ex.ToString()}.";
            }
            return BadRequest(new { Error = message });
        }

        // PUT: api/ItemMaintenance/
        [HttpPut]
        public override async Task<IActionResult> Update(int key, [FromBody] ItemMaintenance record)
        {
            if (key < 1)
                return BadRequest();
            if (record == null)
                return BadRequest();

            // Set date for CrateDate Entity
            record.ModifyDate = DateTime.Now;
            record.StatusMaintenance = this.ChangeStatus(record);
            // +7 Hour
            record = this.helper.AddHourMethod(record);
            // Actual Start DateTime
            if (!string.IsNullOrEmpty(record.ActualStartDateTime) && record.ActualStartDate != null)
            {
                if (DateTime.TryParseExact(record.ActualStartDateTime, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dt))
                    record.ActualStartDate = new DateTime(record.ActualStartDate.Value.Year, record.ActualStartDate.Value.Month, record.ActualStartDate.Value.Day, dt.Hour, dt.Minute, 0);
            }
            // Actual End DateTime
            if (!string.IsNullOrEmpty(record.ActualEndDateTime) && record.ActualEndDate != null)
            {
                if (DateTime.TryParseExact(record.ActualEndDateTime, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime dt))
                    record.ActualEndDate = new DateTime(record.ActualEndDate.Value.Year, record.ActualEndDate.Value.Month, record.ActualEndDate.Value.Day, dt.Hour, dt.Minute, 0);
            }

            foreach (var item in record.ItemMainHasEmployees)
            {
                if (item == null)
                    continue;

                if (item.ItemMainHasEmployeeId > 0)
                {
                    item.ModifyDate = record.ModifyDate;
                    item.Modifyer = record.Modifyer;
                }
                else
                {
                    item.CreateDate = record.ModifyDate;
                    item.Creator = record.Modifyer;
                }
            }
            // Update Requisiton
            foreach (var item in record.RequisitionStockSps)
            {
                if (item == null)
                    continue;
                // If Already have in database
                if (item.RequisitionStockSpId > 0)
                {
                    item.ModifyDate = record.ModifyDate;
                    item.Modifyer = record.Modifyer;
                    item.RequisitionEmp = record.MaintenanceEmp;
                }
                else // if do't have add new to database
                {
                    item.CreateDate = item.ModifyDate;
                    item.Creator = item.Modifyer;
                    item.RequisitionEmp = record.MaintenanceEmp;
                    item.PaperNo = record.ItemMaintenanceNo;
                }
            }

            if (await this.repository.UpdateAsync(record, key) == null)
                return BadRequest();
            else
            {
                // Find requisition of item maintenance
                var dbRequisition = await this.repositoryRequisition.GetToListAsync(x => x, r => r.ItemMaintenanceId == key);
                var dbItemMainHasEmp = await this.repositoryItemMainEmp.GetToListAsync(x => x, e => e.ItemMaintenanceId == key);

                //Remove requisition if edit remove it
                foreach (var item in dbRequisition)
                {
                    if (!record.RequisitionStockSps.Any(x => x.RequisitionStockSpId == item.RequisitionStockSpId))
                    {
                        if (item.MovementStockSpId.HasValue)
                        {
                            var hasMovement = await this.repositoryMovement.GetAsync(item.MovementStockSpId.Value);
                            if (hasMovement != null)
                            {
                                // Cancel Status
                                hasMovement.MovementStatus = MovementStatus.Cancel;
                                hasMovement.ModifyDate = record.ModifyDate;
                                hasMovement.Modifyer = record.Modifyer;
                                // Update
                                await this.repositoryMovement.UpdateAsync(hasMovement, hasMovement.MovementStockSpId);
                            }
                        }
                        await this.repositoryRequisition.DeleteAsync(item.RequisitionStockSpId);
                    }
                }

                foreach (var item in dbItemMainHasEmp)
                {
                    if (!record.ItemMainHasEmployees.Any(x => x.ItemMainHasEmployeeId == item.ItemMainHasEmployeeId))
                        await this.repositoryItemMainEmp.DeleteAsync(item.ItemMainHasEmployeeId);
                }

                //Update ItemMainHasEmployee or New ItemMainHasEmployee
                foreach (var item in record.ItemMainHasEmployees)
                {
                    if (item == null)
                        continue;

                    if (item.ItemMainHasEmployeeId > 0)
                        await this.repositoryItemMainEmp.UpdateAsync(item, item.ItemMainHasEmployeeId);
                    else
                    {
                        if (item.ItemMaintenanceId is null || item.ItemMaintenanceId < 1)
                            item.ItemMaintenanceId = record.ItemMaintenanceId;

                        await this.repositoryItemMainEmp.AddAsync(item);
                    }
                }

                //Update RequisitionStockSps or New RequisitionStockSps
                foreach (var item in record.RequisitionStockSps)
                {
                    if (item == null)
                        continue;

                    if (item.RequisitionStockSpId > 0)
                    {
                        // Update movement
                        var editMovement = await this.repositoryMovement.GetAsync(item.MovementStockSpId.Value);
                        if (editMovement != null)
                        {
                            editMovement.ModifyDate = item.ModifyDate;
                            editMovement.Modifyer = item.Modifyer;
                            editMovement.MovementDate = item.RequisitionDate;
                            editMovement.Quantity = item.Quantity;
                            editMovement.SparePartId = item.SparePartId;

                            await this.repositoryMovement.UpdateAsync(editMovement, editMovement.MovementStockSpId);
                        }
                        await this.repositoryRequisition.UpdateAsync(item, item.RequisitionStockSpId);
                    }
                    else
                    {
                        if (item.ItemMaintenanceId is null || item.ItemMaintenanceId < 1)
                            item.ItemMaintenanceId = record.ItemMaintenanceId;

                        item.MovementStockSp = new MovementStockSp()
                        {
                            CreateDate = item.CreateDate,
                            Creator = item.Creator,
                            MovementDate = item.RequisitionDate,
                            MovementStatus = MovementStatus.RequisitionStock,
                            Quantity = item.Quantity,
                            SparePartId = item.SparePartId,
                        };
                        await this.repositoryRequisition.AddAsync(item);
                    }
                }
            }

            // Update Status RequireMaintenance
            RequireStatus status = record.StatusMaintenance == StatusMaintenance.Cancel ? RequireStatus.Waiting :
                (record.StatusMaintenance == StatusMaintenance.Complate ? RequireStatus.Complate : RequireStatus.InProcess);

            await this.UpdateRequireMaintenance(record.RequireMaintenanceId.Value, record.Creator, status);

            if (record.StatusMaintenance == StatusMaintenance.Complate &&
                record.RequireMaintenanceId != null)
                await this.MaintenanceComplateEmail(record.RequireMaintenanceId.Value);

            if (record.RequireMaintenance != null)
                record.RequireMaintenance = null;
            if (record.ItemMainHasEmployees != null)
                record.ItemMainHasEmployees = null;
            if (record.RequisitionStockSps != null)
                record.RequisitionStockSps = null;

            return new JsonResult(record, this.DefaultJsonSettings);
        }

        // POST: api/ItemMaintenance/ReportList
        [HttpPost("ReportList")]
        public async Task<IActionResult> ReportList([FromBody] ScrollViewModel option, string mode = "")
        {
            var Message = "";
            try
            {
                Expression<Func<ItemMaintenance, bool>> expression = e => e.StatusMaintenance != StatusMaintenance.Cancel;

                if (option.WhereId.HasValue)
                    expression = expression.And(x => x.RequireMaintenance.Item.ItemTypeId.Equals(option.WhereId));

                if (option.Where2Id.HasValue)
                    expression = expression.And(x => x.TypeMaintenanceId.Equals(option.Where2Id));

                if (option.SDate.HasValue)
                    expression = expression.And(x => x.ActualStartDate.Value.Date >= option.SDate.Value.Date);

                if (option.EDate.HasValue)
                    expression = expression.And(x => x.ActualEndDate.Value.Date <= option.EDate.Value.Date || x.ActualEndDate == null);

                var HasData = await this.repository.GetToListAsync(
                    item => item,
                    expression, x => x.OrderBy(z => z.RequireMaintenance.Item.ItemTypeId).ThenBy(z => z.RequireMaintenance.Item.ItemCode),
                    x => x.Include(z => z.RequireMaintenance.Item.ItemType));

                if (HasData != null)
                {
                    var ReportList = new List<HistoryMaintenanceViewModel>();
                    foreach (var item in HasData)
                    {
                        ReportList.Add(new HistoryMaintenanceViewModel()
                        {
                            ItemCode = item?.RequireMaintenance?.Item?.ItemCode ?? "-",
                            ItemType = item?.RequireMaintenance?.Item?.ItemType?.Name ?? "-",
                            ItemName = item?.RequireMaintenance?.Item?.Name ?? "-",
                            Description = item?.Description ?? "-",
                            ApplyRequireDate = item?.RequireMaintenance?.MaintenanceApply ?? null,
                            RequestDate = item?.RequireMaintenance?.RequireDate ?? null,
                            FinishDate = item?.ActualEndDate ?? null
                        });
                    }

                    if (ReportList.Any())
                    {
                        if (mode.IndexOf("Export") != -1)
                        {
                            var table = new DataTable();
                            //Adding the Columns
                            table.Columns.AddRange(new DataColumn[]
                            {
                                new DataColumn("ItemCode", typeof(string)),
                                new DataColumn("ItemType", typeof(string)),
                                new DataColumn("ItemName",typeof(string)),
                                new DataColumn("ApplyRequireDate",typeof(string)),
                                new DataColumn("RequestDate",typeof(string)),
                                new DataColumn("FinishDate",typeof(string)),
                                new DataColumn("Description",typeof(string)),
                            });

                            //Adding the Rows
                            foreach (var item in ReportList)
                            {
                                table.Rows.Add(
                                    item.ItemCode,
                                    item.ItemType,
                                    item.ItemName,
                                    item.ApplyRequireDateString,
                                    item.RequestDateString,
                                    item.FinishDateString,
                                    item.Description
                                );
                            }

                            var templateFolder = this.hosting.WebRootPath + "/files/";
                            var fileExcel = templateFolder + $"export.xlsx";

                            using (XLWorkbook wb = new XLWorkbook())
                            {
                                var wsFreeze = wb.Worksheets.Add(table, "export");
                                wsFreeze.Columns().AdjustToContents();
                                wsFreeze.SheetView.FreezeRows(1);
                                wb.SaveAs(fileExcel);
                            }

                            var memory = new MemoryStream();
                            using (var stream = new FileStream(fileExcel, FileMode.Open))
                            {
                                await stream.CopyToAsync(memory);
                            }
                            memory.Position = 0;

                            return File(memory, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "export.xlsx");
                        }
                        else
                            return new JsonResult(new ScrollDataViewModel<HistoryMaintenanceViewModel>(option,ReportList), this.DefaultJsonSettings);
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { Error = Message });
        }
    }
}