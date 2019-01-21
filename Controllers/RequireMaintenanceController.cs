using System;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using VipcoMaintenance.Services;
using VipcoMaintenance.Services.EmailServices;
using VipcoMaintenance.ViewModels;
using VipcoMaintenance.Models.Machines;
using VipcoMaintenance.Models.Maintenances;
using AutoMapper;
using System.Dynamic;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using VipcoMaintenance.Helper;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;

namespace VipcoMaintenance.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class RequireMaintenanceController : GenericController<RequireMaintenance>
    {
        // Repository
        private readonly IRepositoryMachineMk2<ProjectCodeMaster> repositoryProject;
        private readonly IRepositoryMachineMk2<Employee> repositoryEmployee;
        private readonly IRepositoryMachineMk2<EmployeeGroupMis> repositoryGroupMis;
        private readonly IRepositoryMachineMk2<AttachFile> repositoryAttach;
        private readonly IRepositoryMaintenanceMk2<RequireMaintenanceHasAttach> repositoryHasAttach;
        // Helper
        private readonly IEmailSender emailSender; 
        // IHost
        private readonly IHostingEnvironment hostEnvironment;

        public RequireMaintenanceController(IRepositoryMaintenanceMk2<RequireMaintenance> repo,
            IRepositoryMachineMk2<ProjectCodeMaster> repoPro,
            IRepositoryMachineMk2<Employee> repoEmp,
            IRepositoryMachineMk2<EmployeeGroupMis> repoGroupMis,
            IRepositoryMachineMk2<AttachFile> repoAttach,
            IRepositoryMaintenanceMk2<RequireMaintenanceHasAttach> repoHasAttach,
            IMapper mapper,
            IEmailSender email,
            IHostingEnvironment hostEnv
            ) : base(repo, mapper) {
            // Repository Machine
            this.repositoryEmployee = repoEmp;
            this.repositoryProject = repoPro;
            this.repositoryGroupMis = repoGroupMis;
            this.repositoryAttach = repoAttach;
            this.repositoryHasAttach = repoHasAttach;
            // Helper
            this.emailSender = email;
            // IHost
            this.hostEnvironment = hostEnv;
        }

        #region Property
        private IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }

        #endregion

        // GET: api/RequireMaintenance/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasItem = await this.repository.GetFirstOrDefaultAsync(
                x => x,x => x.RequireMaintenanceId.Equals(key),null,
                x => x.Include(z => z.Branch).Include(z => z.Item));
            if (HasItem != null)
            {
                var MapItem = this.mapper.Map<RequireMaintenance, RequireMaintenanceViewModel>(HasItem);
                if (!string.IsNullOrEmpty(MapItem.RequireEmp))
                    MapItem.RequireEmpString = (await this.repositoryEmployee.GetAsync(MapItem.RequireEmp)).NameThai;

                if (MapItem.ProjectCodeMasterId.HasValue)
                {
                   var HasProject = await this.repositoryProject.GetAsync(MapItem.ProjectCodeMasterId ?? 0);
                    MapItem.ProjectCodeMasterString = HasProject != null ? $"{HasProject.ProjectCode}/{HasProject.ProjectName}" : "-";
                }

                if (!string.IsNullOrEmpty(MapItem.GroupMIS))
                    MapItem.GroupMISString = (await this.repositoryGroupMis.GetAsync(MapItem.GroupMIS)).GroupDesc;

                return new JsonResult(MapItem, this.DefaultJsonSettings);
            }
            return BadRequest();
        }

        // GET: api/ActionRequireMaintenance/5
        [HttpGet("ActionRequireMaintenance")]
        public async Task<IActionResult> ActionRequireMaintenance(int key,string byEmp)
        {
            if (key > 0)
            {
                var HasData = await this.repository.GetFirstOrDefaultAsync(x => x,x => x.RequireMaintenanceId.Equals(key));
                if (HasData != null)
                {
                    HasData.MaintenanceApply = DateTime.Now;
                    HasData.ModifyDate = DateTime.Now;
                    HasData.Modifyer = byEmp;

                    var Complate = await this.repository.UpdateAsync(HasData, key);
                    var EmpName = (await this.repositoryEmployee.GetAsync(HasData.RequireEmp)).NameThai ?? "ไม่ระบุ";

                    if (Complate != null)
                    {
                        if (this.emailSender.IsValidEmail(Complate.MailApply))
                        {
                            var BodyMessage =   "<body style=font-size:11pt;font-family:Tahoma>" +
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

                            await this.emailSender.SendMail(mail);
                        }
                        return Ok(Complate.RequireNo);
                    }
                }
            }
            return BadRequest();
        }

        // POST: api/RequireMaintenance/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {

            if (Scroll == null)
                return BadRequest();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.Split(null);

            var predicate = PredicateBuilder.False<RequireMaintenance>();

            foreach (string temp in filters)
            {
                string keyword = temp.ToLower();
                predicate = predicate.Or(x => x.RequireNo.ToLower().Contains(keyword) ||
                                                x.Item.Name.ToLower().Contains(keyword) ||
                                                x.Item.ItemCode.ToLower().Contains(keyword) ||
                                                x.Remark.ToLower().Contains(keyword) ||
                                                x.Description.ToLower().Contains(keyword));
            }
            if (!string.IsNullOrEmpty(Scroll.Where))
                predicate = predicate.And(p => p.Creator == Scroll.Where);
            //Order by
            Func<IQueryable<RequireMaintenance>, IOrderedQueryable<RequireMaintenance>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "RequireNo":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.RequireNo);
                    else
                        order = o => o.OrderBy(x => x.RequireNo);
                    break;

                case "ItemCode":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Item.ItemCode);
                    else
                        order = o => o.OrderBy(x => x.Item.ItemCode);
                    break;

                case "RequireDate":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.RequireDate);
                    else
                        order = o => o.OrderBy(x => x.RequireDate);
                    break;

                default:
                    order = o => o.OrderByDescending(x => x.RequireDate);
                    break;
            }

            var QueryData = await this.repository.GetToListAsync(
                                    selector: selected => selected,  // Selected
                                    predicate: predicate, // Where
                                    orderBy: order, // Order
                                    include: x => x.Include(z => z.Item).Include(z => z.Branch), // Include
                                    skip: Scroll.Skip ?? 0, // Skip
                                    take: Scroll.Take ?? 50); // Take

            // Get TotalRow
            Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);

            var mapDatas = new List<RequireMaintenanceViewModel>();
            foreach (var item in QueryData)
            {
                var MapItem = this.mapper.Map<RequireMaintenance, RequireMaintenanceViewModel>(item);
                mapDatas.Add(MapItem);
            }

            return new JsonResult(new ScrollDataViewModel<RequireMaintenanceViewModel>(Scroll, mapDatas), this.DefaultJsonSettings);
         }

        // POST: api/RequireMaintenance/
        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] RequireMaintenance record)
        {
            // Set date for CrateDate Entity
            if (record == null)
                return BadRequest();
            // +7 Hour
            record = this.helper.AddHourMethod(record);
            var RunNumber = (await this.repository.GetLengthWithAsync(x => x.RequireDate.Year == record.RequireDate.Year)) + 1;
            record.RequireNo = $"{record.RequireDate.ToString("yy")}-{RunNumber.ToString("0000")}";
            record.CreateDate = DateTime.Now;

            if (!string.IsNullOrEmpty(record.RequireDateTime) && record.RequireDate != null)
            {
                if (DateTime.TryParseExact(record.RequireDateTime, "HH:mm", CultureInfo.InvariantCulture,
                                              DateTimeStyles.None, out DateTime dt))
                    record.RequireDate = new DateTime(record.RequireDate.Year, record.RequireDate.Month, record.RequireDate.Day,
                                                    dt.Hour, dt.Minute, 0);
            }

            if (await this.repository.AddAsync(record) == null)
                return BadRequest();
            return new JsonResult(record, this.DefaultJsonSettings);
        }

        // PUT: api/RequireMaintenance/
        [HttpPut]
        public override async Task<IActionResult> Update(int key, [FromBody] RequireMaintenance record)
        {
            if (key < 1)
                return BadRequest();
            if (record == null)
                return BadRequest();

            // +7 Hour
            record = this.helper.AddHourMethod(record);

            // Set date for CrateDate Entity
            if (record.GetType().GetProperty("ModifyDate") != null)
                record.GetType().GetProperty("ModifyDate").SetValue(record, DateTime.Now);

            if (!string.IsNullOrEmpty(record.RequireDateTime) && record.RequireDate != null)
            {
                if (DateTime.TryParseExact(record.RequireDateTime, "HH:mm", CultureInfo.InvariantCulture,
                                              DateTimeStyles.None, out DateTime dt))
                    record.RequireDate = new DateTime(record.RequireDate.Year, record.RequireDate.Month, record.RequireDate.Day,
                                                    dt.Hour, dt.Minute, 0);
            }

            if (await this.repository.UpdateAsync(record, key) == null)
                return BadRequest();
            return new JsonResult(record, this.DefaultJsonSettings);
        }

        // POST: api/ItemMaintenance/ScheduleWithRequire
        [AllowAnonymous]
        [HttpPost("ScheduleWithRequire")]
        public async Task<IActionResult> ScheduleWithRequire([FromBody] OptionItemMaintananceSchedule Schedule)
        {
            var message = "Data not found.";

            try
            {
                Expression<Func<RequireMaintenance, bool>> expression = x => x.RequireStatus != RequireStatus.Cancel;
                int TotalRow;
                Func<IQueryable<RequireMaintenance>, IOrderedQueryable<RequireMaintenance>> order = o => o.OrderBy(x => x.RequireDate);

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
                                                             x.ItemMaintenance.ItemMaintenanceNo.ToLower().Contains(keyword) ||
                                                             x.ItemMaintenance.TypeMaintenance.Name.ToLower().Contains(keyword) ||
                                                             x.Item.ItemType.Name.ToLower().Contains(keyword) ||
                                                             x.Item.ItemCode.ToLower().Contains(keyword) ||
                                                             x.Item.Name.ToLower().Contains(keyword));
                        }
                    }

                    // Option Mode
                    if (Schedule.Mode.HasValue)
                    {
                        if (Schedule.Mode == 1)
                            order = o => o.OrderByDescending(x => x.RequireDate);
                        else
                        {
                            expression = expression.And(x => x.RequireStatus == RequireStatus.InProcess ||
                                                             x.RequireStatus == RequireStatus.Waiting ||
                                                             x.RequireStatus == RequireStatus.MaintenanceResponse);

                            order = o => o.OrderBy(x => x.RequireDate);
                        }
                    }
                    // Option ProjectMasterId
                    if (Schedule.ProjectMasterId.HasValue)
                        expression = expression.And(x => x.ProjectCodeMasterId == Schedule.ProjectMasterId);
                    // Option Create
                    if (!string.IsNullOrEmpty(Schedule.Creator))
                        expression = expression.And(x => x.RequireEmp == Schedule.Creator);
                    // Option RequireMaintenance
                    if (Schedule.RequireMaintenanceId.HasValue)
                        expression = expression.And(x => x.RequireMaintenanceId == Schedule.RequireMaintenanceId);
                    // Option WorkGroupMaintenance
                    if (Schedule.GroupMaintenanceId.HasValue)
                        expression = expression.And(x => x.ItemMaintenance.WorkGroupMaintenanceId == Schedule.GroupMaintenanceId);

                    TotalRow = await this.repository.GetLengthWithAsync(predicate: expression); 
                    // Option Skip and Task
                    // if (Scehdule.Skip.HasValue && Scehdule.Take.HasValue)
                    // ueryData = QueryData.Skip(Schedule.Skip ?? 0).Take(Schedule.Take ?? 20);
                }
                else
                    TotalRow = await this.repository.GetLengthWithAsync();

                var GetData = await this.repository.GetToListAsync(
                                    selector: selected => selected,  // Selected
                                    predicate: expression, // Where
                                    orderBy: order, // Order
                                    include: x => x.Include(z => z.ItemMaintenance.WorkGroupMaintenance)
                                                   .Include(z => z.Item), // Include
                                    skip: Schedule.Skip ?? 0, // Skip
                                    take: Schedule.Take ?? 50); // Take

                if (GetData.Any())
                {
                    IDictionary<string, int> ColumnGroupTop = new Dictionary<string, int>();
                    IDictionary<DateTime, string> ColumnGroupBtm = new Dictionary<DateTime, string>();
                    List<string> ColumnsAll = new List<string>();
                    // PlanDate
                    List<DateTime?> ListDate = new List<DateTime?>()
                    {
                        //START Date
                        GetData.Min(x => x.RequireDate),
                        GetData.Min(x => x?.ItemMaintenance?.PlanStartDate) ?? null,
                        GetData.Min(x => x?.ItemMaintenance?.ActualStartDate) ?? null,
                        GetData.Min(x => x?.MaintenanceApply) ?? null,
                        //END Date
                        GetData.Max(x => x.RequireDate),
                        GetData.Max(x => x?.ItemMaintenance?.PlanEndDate) ?? null,
                        GetData.Max(x => x?.ItemMaintenance?.ActualEndDate) ?? null,
                        GetData.Max(x => x?.MaintenanceApply) ?? null,
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

                    var DataTable = new List<IDictionary<string, object>>();
                    // OrderBy(x => x.Machine.TypeMachineId).ThenBy(x => x.Machine.MachineCode)
                    foreach (var Data in GetData.OrderBy(x => x.RequireDate).ThenBy(x => x.CreateDate))
                    {
                        IDictionary<string, object> rowData = new ExpandoObject();
                        var Progress = Data?.ItemMaintenance?.StatusMaintenance != null ? System.Enum.GetName(typeof(StatusMaintenance), Data.ItemMaintenance.StatusMaintenance) : "NoAction";
                        var ProjectMaster = "NoData";
                        if (Data?.ProjectCodeMasterId != null)
                        {
                            var ProjectData = await this.repositoryProject.
                                        GetAsync(Data.ProjectCodeMasterId ?? 0);
                            ProjectMaster = ProjectData != null ? ($"{ProjectData.ProjectCode}/{ProjectData.ProjectName}") : "-";
                            if (ProjectMaster.Length > 25)
                            {
                                ProjectMaster = ProjectMaster.Substring(0, 25) + "...";
                            }
                        }

                        // add column time
                        rowData.Add("ProjectMaster", ProjectMaster);
                        rowData.Add("GroupMaintenance", Data?.ItemMaintenance?.WorkGroupMaintenance?.Description ?? "Not-Assign");
                        rowData.Add("Item", (Data == null ? "Data not been found" : $"{Data.Item.ItemCode}/{Data.Item.Name}"));
                        rowData.Add("Progress", Progress);
                        rowData.Add("ItemMainStatus", Data?.ItemMaintenance != null ? Data.ItemMaintenance.StatusMaintenance : StatusMaintenance.Cancel);
                        rowData.Add("ItemMaintenanceId", Data?.ItemMaintenance != null ? Data.ItemMaintenance.ItemMaintenanceId : 0);
                        // Add new
                        if (Data.MaintenanceApply.HasValue)
                        {
                            if (ColumnGroupBtm.Any(x => x.Key == Data.MaintenanceApply.Value.Date))
                                rowData.Add("Response", ColumnGroupBtm.FirstOrDefault(x => x.Key == Data.MaintenanceApply.Value.Date).Value);
                        }
                        // End new

                        // Data is 1:Plan,2:Actual,3:PlanAndActual
                        // For Plan1
                        if (Data.ItemMaintenance != null)
                        {
                            if (Data?.ItemMaintenance?.PlanStartDate != null && Data?.ItemMaintenance?.PlanEndDate != null)
                            {
                                // If Same Date can't loop
                                if (Data?.ItemMaintenance?.PlanStartDate.Date == Data?.ItemMaintenance?.PlanEndDate.Date)
                                {
                                    if (ColumnGroupBtm.Any(x => x.Key == Data?.ItemMaintenance?.PlanStartDate.Date))
                                        rowData.Add(ColumnGroupBtm.FirstOrDefault(x => x.Key == Data?.ItemMaintenance?.PlanStartDate.Date).Value, 1);
                                }
                                else
                                {
                                    foreach (DateTime day in EachDate.EachDate(Data.ItemMaintenance.PlanStartDate, Data.ItemMaintenance.PlanEndDate))
                                    {
                                        if (ColumnGroupBtm.Any(x => x.Key == day.Date))
                                            rowData.Add(ColumnGroupBtm.FirstOrDefault(x => x.Key == day.Date).Value, 1);
                                    }
                                }
                            }

                            //For Actual
                            if (Data?.ItemMaintenance?.ActualStartDate != null)
                            {
                                var EndDate = Data?.ItemMaintenance?.ActualEndDate ?? (MaxDate > DateTime.Today ? DateTime.Today : MaxDate);
                                if (Data?.ItemMaintenance?.ActualStartDate.Value.Date > EndDate.Value.Date)
                                    EndDate = Data?.ItemMaintenance?.ActualStartDate;
                                // If Same Date can't loop 
                                if (Data?.ItemMaintenance?.ActualStartDate.Value.Date == EndDate.Value.Date)
                                {
                                    if (ColumnGroupBtm.Any(x => x.Key == Data?.ItemMaintenance?.ActualStartDate.Value.Date))
                                    {
                                        var Col = ColumnGroupBtm.FirstOrDefault(x => x.Key == Data?.ItemMaintenance?.ActualStartDate.Value.Date);
                                        // if Have Plan change value to 3
                                        if (rowData.Keys.Any(x => x == Col.Value))
                                            rowData[Col.Value] = 3;
                                        else // else Don't have plan value is 2
                                            rowData.Add(Col.Value, 2);
                                    }
                                }
                                else
                                {
                                    foreach (DateTime day in EachDate.EachDate(Data.ItemMaintenance.ActualStartDate.Value, EndDate.Value))
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

        // POST: api/RequireMaintenance/MaintenanceWaiting
        [HttpPost("MaintenanceWaiting")]
        public async Task<IActionResult> MaintenanceWaiting([FromBody] OptionRequireMaintenace option)
        {
            string Message = "";
            try
            {
                Expression<Func<RequireMaintenance, bool>> expression = x => x.RequireStatus != RequireStatus.Cancel;
                int TotalRow;
                if (option != null)
                {
                    if (!string.IsNullOrEmpty(option.Filter))
                    {
                        // Filter
                        var filters = string.IsNullOrEmpty(option.Filter) ? new string[] { "" }
                                            : option.Filter.ToLower().Split(null);
                        foreach (var keyword in filters)
                        {
                            expression = expression.And(x => x.Description.ToLower().Contains(keyword) ||
                                                             x.Remark.ToLower().Contains(keyword) ||
                                                             x.Item.ItemCode.ToLower().Contains(keyword) ||
                                                             x.Item.Name.ToLower().Contains(keyword));
                        }
                    }

                    // Option ProjectCodeMaster
                    if (option.ProjectId.HasValue)
                        expression = expression.And(x => x.ProjectCodeMasterId == option.ProjectId);

                    // Option Status
                    if (option.Status.HasValue)
                    {
                        //if (option.Status == 1)
                        //    QueryData = QueryData.Where(x => x.RequireStatus == RequireStatus.Waiting);
                        //else if (option.Status == 2)
                        //    QueryData = QueryData.Where(x => x.RequireStatus == RequireStatus.InProcess);
                        //else
                        //    QueryData = QueryData.Where(x => x.RequireStatus != RequireStatus.Cancel);

                        expression = expression.And(
                            x => x.RequireStatus != RequireStatus.Cancel && 
                            x.RequireStatus != RequireStatus.Complate);
                    }
                    else
                        expression = expression.And(x => x.RequireStatus == RequireStatus.Waiting);

                    TotalRow = await this.repository.GetLengthWithAsync(expression);
                }
                else
                    TotalRow = await this.repository.GetLengthWithAsync();

                var GetData = await this.repository.GetToListAsync(
                                    selector: selected => selected,  // Selected
                                    predicate: expression, // Where
                                    orderBy: null, // Order
                                    include: x => x.Include(z => z.ItemMaintenance).Include(z => z.Item.ItemType), // Include
                                    skip: option.Skip ?? 0, // Skip
                                    take: option.Take ?? 50); // Take

                if (GetData.Any())
                {
                    List<string> Columns = new List<string>();

                    var MinDate = GetData.Min(x => x.RequireDate);
                    var MaxDate = GetData.Max(x => x.RequireDate);

                    if (MinDate == null && MaxDate == null)
                    {
                        return NotFound(new { Error = "Data not found" });
                    }

                    foreach (DateTime day in EachDay(MinDate, MaxDate))
                    {
                        if (GetData.Any(x => x.RequireDate.Date == day.Date))
                            Columns.Add(day.Date.ToString("dd/MM/yy"));
                    }

                    var DataTable = new List<IDictionary<string, object>>();

                    foreach (var Data in GetData.OrderBy(x => x.Item.ItemType.Name))
                    {
                        var ItemTypeName = $"{Data.Item.ItemType.Name ?? "No-Data"}";

                        IDictionary<string, object> rowData;
                        bool update = false;
                        if (DataTable.Any(x => (string)x["ItemTypeName"] == ItemTypeName))
                        {
                            var FirstData = DataTable.FirstOrDefault(x => (string)x["ItemTypeName"] == ItemTypeName);
                            if (FirstData != null)
                            {
                                rowData = FirstData;
                                update = true;
                            }
                            else
                                rowData = new ExpandoObject();
                        }
                        else
                            rowData = new ExpandoObject();

                        //Get Employee Name
                        // var Employee = await this.repositoryEmp.GetAsync(Data.RequireEmp);
                        // var EmployeeReq = Employee != null ? $"คุณ{(Employee?.NameThai ?? "")}" : "No-Data";

                        var Key = Data.RequireDate.ToString("dd/MM/yy");
                        // New Data
                        var Master = new RequireMaintenanceViewModel()
                        {
                            RequireMaintenanceId = Data.RequireMaintenanceId,
                            MaintenanceApply = Data.MaintenanceApply != null ? Data.MaintenanceApply : null,
                            // RequireString = $"{EmployeeReq} | No.{Data.RequireNo}",
                            ItemCode = $"{Data.Item.ItemCode}/{Data.Item.Name}",
                            RequireEmpString = string.IsNullOrEmpty(Data.RequireEmp) ? "-" : "คุณ" + (await this.repositoryEmployee.GetAsync(Data.RequireEmp)).NameThai,
                            RequireStatus = Data.RequireStatus == RequireStatus.Waiting && Data.MaintenanceApply == null ? RequireStatus.Waiting : 
                                            (Data.RequireStatus == RequireStatus.Waiting && Data.MaintenanceApply != null ? RequireStatus.MaintenanceResponse :
                                            (Data.RequireStatus == RequireStatus.InProcess && Data.ItemMaintenance == null ? RequireStatus.MaintenanceResponse : RequireStatus.InProcess)),
                            ItemMaintenanceId = Data.ItemMaintenance != null ? Data.ItemMaintenance.ItemMaintenanceId : 0
                        };

                        if (rowData.Any(x => x.Key == Key))
                        {
                            // New Value
                            var ListMaster = (List<RequireMaintenanceViewModel>)rowData[Key];
                            ListMaster.Add(Master);
                            // add to row data
                            rowData[Key] = ListMaster;
                        }
                        else // add new
                            rowData.Add(Key, new List<RequireMaintenanceViewModel>() { Master });

                        if (!update)
                        {
                            rowData.Add("ItemTypeName", ItemTypeName);
                            DataTable.Add(rowData);
                        }
                    }

                    return new JsonResult(new
                    {
                        TotalRow,
                        Columns,
                        DataTable
                    }, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }

        [HttpPost("MaintenanceWaitingV2")]
        public async Task<IActionResult> MaintenanceWaitingV2([FromBody] OptionRequireMaintenace option)
        {
            var message = "";
            try
            {
                Expression<Func<RequireMaintenance, bool>> expression = x => x.RequireStatus != RequireStatus.Cancel;
                int TotalRow;
                if (option != null)
                {
                    if (!string.IsNullOrEmpty(option.Filter))
                    {
                        // Filter
                        var filters = string.IsNullOrEmpty(option.Filter) ? new string[] { "" }
                                            : option.Filter.ToLower().Split(null);
                        foreach (var keyword in filters)
                        {
                            expression = expression.And(x => x.Description.ToLower().Contains(keyword) ||
                                                             x.Remark.ToLower().Contains(keyword) ||
                                                             x.Item.ItemCode.ToLower().Contains(keyword) ||
                                                             x.Item.Name.ToLower().Contains(keyword));
                        }
                    }

                    // Option ProjectCodeMaster
                    if (option.ProjectId.HasValue)
                        expression = expression.And(x => x.ProjectCodeMasterId == option.ProjectId);

                    // Option Status
                    if (option.Status.HasValue)
                    {
                        expression = expression.And(
                            x => x.RequireStatus != RequireStatus.Cancel &&
                            x.RequireStatus != RequireStatus.Complate);
                    }
                    else
                        expression = expression.And(x => x.RequireStatus == RequireStatus.Waiting);

                    TotalRow = await this.repository.GetLengthWithAsync(expression);
                }
                else
                    TotalRow = await this.repository.GetLengthWithAsync();

                var GetData = await this.repository.GetToListAsync(
                                    selector: selected => selected,  // Selected
                                    predicate: expression, // Where
                                    orderBy: null, // Order
                                    include: x => x.Include(z => z.ItemMaintenance).Include(z => z.Item.ItemType), // Include
                                    skip: option.Skip ?? 0, // Skip
                                    take: option.Take ?? 50); // Take

                if (GetData.Any())
                {
                    var emps = new List<Employee>();
                    var empCodes = GetData.GroupBy(x => x.RequireEmp).Select(x => x.Key).ToList();

                    var ListData = new List<ScheduleRequireViewModel>();
                    foreach (var DataByDate in GetData.GroupBy(x => x.RequireDate))
                    {
                        var newData = new ScheduleRequireViewModel()
                        {
                            RequireDate = DataByDate.Key,
                            ListItem = new Dictionary<string,List<ScheduleRequireSubViewModel>>()
                        };

                        foreach (var DataByType in DataByDate.GroupBy(x => x.Item.ItemType))
                        {
                            var listSub = new List<ScheduleRequireSubViewModel>();
                            foreach (var item in DataByType)
                            {
                                listSub.Add(new ScheduleRequireSubViewModel()
                                {
                                    RequireMaintenanceId = item.RequireMaintenanceId,
                                    MaintenanceApply = item.MaintenanceApply,
                                    ItemCodeName = $"{item.Item.ItemCode}/{item.Item.Name}",
                                    RequireEmpString = string.IsNullOrEmpty(item.RequireEmp) ? "-" : "คุณ" + (await this.repositoryEmployee.GetAsync(item.RequireEmp)).NameThai,
                                    RequireStatus = item.RequireStatus == RequireStatus.Waiting && item.MaintenanceApply == null ? RequireStatus.Waiting :
                                            (item.RequireStatus == RequireStatus.Waiting && item.MaintenanceApply != null ? RequireStatus.MaintenanceResponse :
                                            (item.RequireStatus == RequireStatus.InProcess && item.ItemMaintenance == null ? RequireStatus.MaintenanceResponse : RequireStatus.InProcess)),
                                    ItemMaintenanceId = item.ItemMaintenance.ItemMaintenanceId
                                });
                            }

                            newData.ListItem.Add(DataByType.Key.Name, listSub);
                        }
                    }

                    return new JsonResult(new
                    {
                        TotalRow,
                        ListData
                    }, this.DefaultJsonSettings);
                }
            }
            catch(Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }
            return BadRequest(new { message });
        }

        #region ATTACH

        // GET: api/RequirePaintingList/GetAttach/5
        [HttpGet("GetAttach")]
        public async Task<IActionResult> GetAttach(int key)
        {
            var AttachIds = await this.repositoryHasAttach.GetToListAsync(
                x => x.AttachFileId, x => x.RequireMaintenanceId == key);
            if (AttachIds != null)
            {
                var DataAttach = await this.repositoryAttach.GetToListAsync(x => x, x => AttachIds.Contains(x.AttachFileId));
                return new JsonResult(DataAttach, this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "Attatch not been found." });
        }

        // POST: api/RequirePaintingList/PostAttach/5/Someone
        [HttpPost("PostAttach")]
        public async Task<IActionResult> PostAttac(int key, string CreateBy, IEnumerable<IFormFile> files)
        {
            string Message = "";
            try
            {
                long size = files.Sum(f => f.Length);

                // full path to file in temp location
                var filePath1 = Path.GetTempFileName();

                foreach (var formFile in files)
                {
                    string FileName = Path.GetFileName(formFile.FileName).ToLower();
                    // create file name for file
                    string FileNameForRef = $"{DateTime.Now.ToString("ddMMyyhhmmssfff")}{ Path.GetExtension(FileName).ToLower()}";
                    // full path to file in temp location
                    var filePath = Path.Combine(this.hostEnvironment.WebRootPath + "/files", FileNameForRef);

                    if (formFile.Length > 0)
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                            await formFile.CopyToAsync(stream);
                    }

                    var returnData = await this.repositoryAttach.AddAsync(new AttachFile()
                    {
                        FileAddress = $"/maintenance/files/{FileNameForRef}",
                        FileName = FileName,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone"
                    });

                    await this.repositoryHasAttach.AddAsync(new RequireMaintenanceHasAttach()
                    {
                        AttachFileId = returnData.AttachFileId,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone",
                        RequireMaintenanceId = key
                    });
                }

                return Ok(new { count = 1, size, filePath1 });

            }
            catch (Exception ex)
            {
                Message = ex.ToString();
            }

            return NotFound(new { Error = "Not found " + Message });
        }

        // DELETE: api/RequirePaintingList/DeleteAttach/5
        [HttpDelete("DeleteAttach")]
        public async Task<IActionResult> DeleteAttach(int AttachFileId)
        {
            if (AttachFileId > 0)
            {
                var AttachFile = await this.repositoryAttach.GetAsync(AttachFileId);
                if (AttachFile != null)
                {
                    var filePath = Path.Combine(this.hostEnvironment.WebRootPath + AttachFile.FileAddress);
                    FileInfo delFile = new FileInfo(filePath);

                    if (delFile.Exists)
                        delFile.Delete();
                    // Condition
                    var RequireMaitenanceHasAttach = await this.repositoryHasAttach.GetFirstOrDefaultAsync(
                        x => x,x => x.AttachFileId == AttachFile.AttachFileId);

                    if (RequireMaitenanceHasAttach != null)
                        this.repositoryHasAttach.Delete(RequireMaitenanceHasAttach.RequireMaintenanceHasAttachId);
                    // remove attach
                    return new JsonResult(await this.repositoryAttach.DeleteAsync(AttachFile.AttachFileId), this.DefaultJsonSettings);
                }
            }
            return NotFound(new { Error = "Not found attach file." });
        }

        #endregion
    }
}
