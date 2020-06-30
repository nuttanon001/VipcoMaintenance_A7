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
using VipcoMaintenance.Services.ExcelExportServices;
using VipcoMaintenance.ViewModels.Require;
using ClosedXML.Excel;

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
        private readonly IRepositoryMaintenanceMk2<Item> repositoryItem;
        private readonly IRepositoryDapper<RequireMaintenance> dapper;
        // Helper
        private readonly IEmailSender emailSender;
        private readonly IHelperService helperService;
        private readonly ExcelWorkBookService excelService;
        // IHost
        private readonly IHostingEnvironment hostEnvironment;

        public RequireMaintenanceController(IRepositoryMaintenanceMk2<RequireMaintenance> repo,
            IRepositoryMachineMk2<ProjectCodeMaster> repoPro,
            IRepositoryMachineMk2<Employee> repoEmp,
            IRepositoryMachineMk2<EmployeeGroupMis> repoGroupMis,
            IRepositoryMachineMk2<AttachFile> repoAttach,
            IRepositoryMaintenanceMk2<RequireMaintenanceHasAttach> repoHasAttach,
            IRepositoryMaintenanceMk2<Item> repoItem,
            IRepositoryDapper<RequireMaintenance> _dapper,
            IMapper mapper,
            IEmailSender email,
            IHelperService helpService,
            IHostingEnvironment hostEnv,
            ExcelWorkBookService _excelService
            ) : base(repo, mapper) {
            // Repository Machine
            this.repositoryEmployee = repoEmp;
            this.repositoryProject = repoPro;
            this.repositoryGroupMis = repoGroupMis;
            this.repositoryAttach = repoAttach;
            this.repositoryHasAttach = repoHasAttach;
            this.repositoryItem = repoItem;
            this.dapper = _dapper;
            // Helper
            this.emailSender = email;
            this.helperService = helpService;
            this.excelService = _excelService;
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

        #region PrivateMethods

        private SqlCommandViewModel CreateRequireMaintenance(ScrollViewModel option)
        {
            #region Where
            var sWhere = "";

            if (!string.IsNullOrEmpty(option.Filter))
            {
                var filters = string.IsNullOrEmpty(option.Filter) ? new string[] { "" }
                            : option.Filter.Split(null);

                foreach (var temp in filters)
                {
                    if (string.IsNullOrEmpty(temp))
                        continue;

                    string keyword = temp.ToLower();
                    sWhere += (string.IsNullOrEmpty(sWhere) ? " " : " AND ") +
                                                    $@"(LOWER([req].[Description]) LIKE '%{keyword}%'
                                                    OR LOWER([itm].[ItemCode]) LIKE '%{keyword}%'
                                                    OR LOWER([itm].[Name]) LIKE '%{keyword}%'
                                                    OR LOWER([req].[Remark]) LIKE '%{keyword}%')";
                }
            }

            // Option ProjectCodeMaster
            if (option.WhereId2.HasValue)
                sWhere += (string.IsNullOrEmpty(sWhere) ? " " : " AND ") + $"req.ProjectCodeMasterId = {option.WhereId2}";
            // Option TypeMaintenance
            if (option.WhereId3.HasValue)
                sWhere += (string.IsNullOrEmpty(sWhere) ? " " : " AND ") + $"typ.ItemTypeId = {option.WhereId3}";


            // Option Status
            if (option.WhereId.HasValue)
                sWhere += (string.IsNullOrEmpty(sWhere) ? " " : " AND ") + $"req.RequireStatus NOT IN (3,4)";
            else
                sWhere += (string.IsNullOrEmpty(sWhere) ? " " : " AND ") + $"req.RequireStatus = 2";
            #endregion

            #region Sort
            var sSort = " req.RequireDate ASC ";
            #endregion

            return new SqlCommandViewModel()
            {
                SelectCommand = $@" req.RequireDate
                                    ,req.ItemId
                                    ,req.RequireMaintenanceId
                                    ,req.MaintenanceApply
                                    ,req.RequireEmp
                                    ,req.RequireStatus
                                    ,req.[Description]
                                    -- main
                                    ,main.ItemMaintenanceId
                                    ,main.ItemMaintenanceNo
                                    ,main.PlanEndDate
                                    ,main.[Remark]
                                    -- item
                                    ,itm.ItemCode
                                    ,itm.[Name] AS ItemName
                                    ,typ.[Name] AS TypeName
                                    -- emp
                                    ,emp.NameThai
                                    ,emp.GroupName",
                FromCommand = $@" [dbo].[RequireMaintenance] req
                                    LEFT OUTER JOIN	[dbo].[ItemMaintenance] main
                                        ON main.RequireMaintenanceId = req.RequireMaintenanceId
                                    LEFT OUTER JOIN [dbo].[Item] itm
                                        ON itm.ItemId = req.ItemId
                                    LEFT OUTER JOIN [dbo].[ItemType] typ
                                        ON typ.ItemTypeId = itm.ItemTypeId
                                    LEFT OUTER JOIN [VipcoMachineDataBase].[dbo].[Employee] emp
                                        ON emp.EmpCode = req.RequireEmp",
                WhereCommand = sWhere,
                OrderCommand = sSort
            };
             
        }

        #endregion

        // GET: api/RequireMaintenance/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {

            var hasData = await this.dapper.GetFirstEntity<RequireMaintenanceViewModel>(new SqlCommandViewModel()
            {
                SelectCommand = $@" req.BranchId
                                    ,bh.[Name] AS BranchString
                                    ,req.[Description]
                                    ,req.GroupMIS
                                    ,itm.ItemCode + '/' + itm.[Name] AS ItemCode 
                                    ,req.ItemId
                                    ,req.MailApply
                                    ,req.MaintenanceApply
                                    ,req.ProjectCodeMasterId
                                    ,req.Remark
                                    ,req.RequireDate
                                    ,req.RequireDateTime
                                    ,req.RequireEmp
                                    ,req.RequireMaintenanceId
                                    ,req.RequireNo
                                    ,req.RequireStatus 
                                    ,req.CreateDate
                                    ,req.Creator
                                    ,req.ModifyDate
                                    ,req.Modifyer
                                    ,emp.NameThai AS RequireEmpString
                                    ,pro.ProjectCode + '/' + pro.ProjectName AS ProjectCodeMasterString
                                    ,gup.GroupDesc AS GroupMISString",
                FromCommand = $@"dbo.RequireMaintenance req
                                LEFT OUTER JOIN dbo.Branch bh ON bh.BranchId = req.BranchId
                                LEFT OUTER JOIN dbo.Item itm ON itm.ItemId = req.ItemId
                                LEFT OUTER JOIN VipcoMachineDataBase.dbo.Employee emp ON emp.EmpCode = req.RequireEmp
                                LEFT OUTER JOIN VipcoMachineDataBase.dbo.ProjectCodeMaster pro ON pro.ProjectCodeMasterId = req.ProjectCodeMasterId
                                LEFT OUTER JOIN VipcoMachineDataBase.dbo.EmployeeGroupMIS gup ON gup.GroupMIS = req.GroupMIS",
                WhereCommand = $"RequireMaintenanceId = {key}"
            });

            return new JsonResult(hasData, this.DefaultJsonSettings);
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
                                    selector: x => new RequireMaintenanceViewModel
                                    {
                                        BranchId = x.BranchId,
                                        BranchString = x.Branch.Name,
                                        Description = x.Description,
                                        GroupMIS = x.GroupMIS,
                                        ItemCode = x.Item != null ? $"{x.Item.ItemCode}/{x.Item.Name}" : "-",
                                        ItemId = x.ItemId,
                                        MailApply = x.MailApply,
                                        MaintenanceApply = x.MaintenanceApply,
                                        ProjectCodeMasterId = x.ProjectCodeMasterId,
                                        Remark = x.Remark,
                                        RequireDate = x.RequireDate,
                                        RequireDateTime = x.RequireDateTime,
                                        RequireEmp = x.RequireEmp,
                                        RequireMaintenanceId = x.RequireMaintenanceId,
                                        RequireNo = x.RequireNo,
                                        RequireStatus = x.RequireStatus,
                                    },  // Selected
                                    predicate: predicate, // Where
                                    orderBy: order, // Order
                                    include: x => x.Include(z => z.Item).Include(z => z.Branch), // Include
                                    skip: Scroll.Skip ?? 0, // Skip
                                    take: Scroll.Take ?? 50); // Take

            // Get TotalRow
            Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);

            //var mapDatas = new List<RequireMaintenanceViewModel>();
            //foreach (var item in QueryData)
            //{
            //    var MapItem = this.mapper.Map<RequireMaintenance, RequireMaintenanceViewModel>(item);
            //    mapDatas.Add(MapItem);
            //}

            return new JsonResult(new ScrollDataViewModel<RequireMaintenanceViewModel>(Scroll, QueryData.ToList()), this.DefaultJsonSettings);
         }

        // POST: api/RequireMaintenance/
        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] RequireMaintenance record)
        {
            // Set date for CrateDate Entity
            if (record == null)
                return BadRequest();
            // +7 Hour
            // record = this.helper.AddHourMethod(record);
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
            // record = this.helper.AddHourMethod(record);

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

                var GetDataTemp = await this.repository.GetToListAsync(
                                    selector: x => new
                                    {
                                        x.RequireDate,
                                        PlanStartDate = (x.ItemMaintenance == null ? null : (DateTime?)x.ItemMaintenance.PlanStartDate),
                                        PlanEndDate = (x.ItemMaintenance == null ? null : (DateTime?)x.ItemMaintenance.PlanEndDate),
                                        ActualEndDate = (x.ItemMaintenance == null ? null : x.ItemMaintenance.ActualEndDate),
                                        ActualStartDate = (x.ItemMaintenance == null ? null : x.ItemMaintenance.ActualStartDate),
                                        x.MaintenanceApply,
                                        x.CreateDate,
                                        StatusMaintenance = x.ItemMaintenance == null ? "NoAction" : System.Enum.GetName(typeof(StatusMaintenance), x.ItemMaintenance.StatusMaintenance),
                                        x.ProjectCodeMasterId,
                                        WorkGroupMaintenance = x.ItemMaintenance == null ? "Not-Assign" : x.ItemMaintenance.WorkGroupMaintenance.Description,
                                        ItemCode = x.Item == null ? "Data not been found" : $"{x.Item.ItemCode}/{x.Item.Name}",
                                        ItemMaintenanceId = x.ItemMaintenance == null ? 0 : x.ItemMaintenance.ItemMaintenanceId
                                    },  // Selected
                                    predicate: expression, // Where
                                    orderBy: order, // Order
                                    include: x => x.Include(z => z.ItemMaintenance.WorkGroupMaintenance)
                                                   .Include(z => z.Item), // Include
                                    skip: Schedule.Skip ?? 0, // Skip
                                    take: Schedule.Take ?? 50); // Take

                if (GetDataTemp.Any())
                {
                    var GetData = GetDataTemp.ToList();
                    IDictionary<string, int> ColumnGroupTop = new Dictionary<string, int>();
                    IDictionary<DateTime, string> ColumnGroupBtm = new Dictionary<DateTime, string>();
                    List<string> ColumnsAll = new List<string>();
                    // PlanDate
                    List<DateTime?> ListDate = new List<DateTime?>()
                    {
                        //START Date
                        GetData.Min(x => x.RequireDate),
                        GetData.Min(x => x?.PlanStartDate) ?? null,
                        GetData.Min(x => x?.ActualStartDate) ?? null,
                        GetData.Min(x => x?.MaintenanceApply) ?? null,
                        //END Date
                        GetData.Max(x => x.RequireDate),
                        GetData.Max(x => x?.PlanEndDate) ?? null,
                        GetData.Max(x => x?.ActualEndDate) ?? null,
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
                        var Progress = Data?.StatusMaintenance;
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
                        rowData.Add("GroupMaintenance", Data?.WorkGroupMaintenance);
                        rowData.Add("Item", Data.ItemCode);
                        rowData.Add("Progress", Progress);
                        rowData.Add("ItemMainStatus", Data.StatusMaintenance);
                        rowData.Add("ItemMaintenanceId", Data.ItemMaintenanceId);
                        // Add new
                        if (Data.MaintenanceApply.HasValue)
                        {
                            if (ColumnGroupBtm.Any(x => x.Key == Data.MaintenanceApply.Value.Date))
                                rowData.Add("Response", ColumnGroupBtm.FirstOrDefault(x => x.Key == Data.MaintenanceApply.Value.Date).Value);
                        }
                        // End new

                        // Data is 1:Plan,2:Actual,3:PlanAndActual
                        // For Plan1
                        if (Data?.PlanStartDate != null && Data?.PlanEndDate != null)
                        {
                            // If Same Date can't loop
                            if (Data?.PlanStartDate.Value.Date == Data?.PlanEndDate.Value.Date)
                            {
                                if (ColumnGroupBtm.Any(x => x.Key == Data?.PlanStartDate.Value.Date))
                                    rowData.Add(ColumnGroupBtm.FirstOrDefault(x => x.Key == Data?.PlanStartDate.Value.Date).Value, 1);
                            }
                            else
                            {
                                foreach (DateTime day in EachDate.EachDate(Data.PlanStartDate.Value, Data.PlanEndDate.Value))
                                {
                                    if (ColumnGroupBtm.Any(x => x.Key == day.Date))
                                        rowData.Add(ColumnGroupBtm.FirstOrDefault(x => x.Key == day.Date).Value, 1);
                                }
                            }
                        }

                        //For Actual
                        if (Data?.ActualStartDate != null)
                        {
                            var EndDate = Data?.ActualEndDate ?? (MaxDate > DateTime.Today ? DateTime.Today : MaxDate);
                            if (Data?.ActualStartDate.Value.Date > EndDate.Value.Date)
                                EndDate = Data?.ActualStartDate;
                            // If Same Date can't loop 
                            if (Data?.ActualStartDate.Value.Date == EndDate.Value.Date)
                            {
                                if (ColumnGroupBtm.Any(x => x.Key == Data?.ActualStartDate.Value.Date))
                                {
                                    var Col = ColumnGroupBtm.FirstOrDefault(x => x.Key == Data?.ActualStartDate.Value.Date);
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

        // POST: api/RequireMaintenance/MaintenanceWaiting
        [HttpPost("MaintenanceWaiting")]
        public async Task<IActionResult> MaintenanceWaiting([FromBody] ScrollViewModel option)
        {
            try
            {
                if (option != null)
                {
                    var hasData = await this.dapper.GetEntitiesAndTotal<OptionRequireMaintenace, RequireMTVm>
                        (this.CreateRequireMaintenance(option), new OptionRequireMaintenace() { Skip = option.Skip ?? 0, Take = option.Take ?? 50 });

                    if (hasData != null)
                    {
                        // Group by date
                        var byDates = hasData.Entities.GroupBy(x => x.RequireDate).ToList();
                        // List require
                        var listDatas = new List<RequireGroupVm>();
                        // Foreach
                        foreach (var byDate in byDates.OrderBy(x => x.Key))
                        {
                            if (byDate.Key != null)
                            {
                                var getData = listDatas.FirstOrDefault(x => x.RequireDate.Date == byDate.Key.Value.Date);
                                if (getData == null)
                                {
                                    getData = new RequireGroupVm() { RequireDate = byDate.Key.Value.Date };
                                    // Add to list
                                    listDatas.Add(getData);
                                }

                                foreach (var item in byDate)
                                {
                                    // Check status and maintenance apply
                                    item.RequireStatus = item.RequireStatus == RequireStatus.Waiting && item.MaintenanceApply == null ? RequireStatus.Waiting :
                                            (item.RequireStatus == RequireStatus.Waiting && item.MaintenanceApply != null ? RequireStatus.MaintenanceResponse :
                                            (item.RequireStatus == RequireStatus.InProcess && item.ItemMaintenanceId == null ? RequireStatus.MaintenanceResponse : RequireStatus.InProcess));

                                    switch (item.TypeName)
                                    {
                                        case "Tool":
                                            getData.Tools.Add(item);
                                            break;
                                        case "Machine":
                                            getData.Machines.Add(item);
                                            break;
                                        case "Other":
                                            getData.Others.Add(item);
                                            break;
                                    }
                                }
                            }
                        }

                        return new JsonResult(new { dataTable = listDatas, totalRow = hasData.TotalRow },this.DefaultJsonSettings);
                    }
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Has error {ex.ToString()}");
            }

            return NoContent();
        }
               

        [HttpPost("MaintenanceWaitingReport")]
        public async Task<IActionResult> MaintenanceWaitingReport([FromBody] ScrollViewModel option)
        {
            try
            {
                var hasData = await this.dapper.GetListEntites<RequireMTVm>(this.CreateRequireMaintenance(option));

                if (hasData.Any())
                {
                    var memory = new MemoryStream();

                    using (var wb = this.excelService.Create())
                    {
                        // Add worksheets
                        var ws = wb.Worksheets.Add(("RequireMaintenance"));

                        var byType = hasData.GroupBy(x => x.TypeName).ToList();

                        #region Style

                        var titleStyle = XLWorkbook.DefaultStyle;
                        titleStyle.Font.Bold = true;
                        titleStyle.Font.FontColor = XLColor.SteelBlue;
                        titleStyle.Font.FontSize = 13;
                        titleStyle.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                        var subTitleStyle = XLWorkbook.DefaultStyle;
                        subTitleStyle.Font.Bold = true;
                        subTitleStyle.Font.FontColor = XLColor.Black;
                        subTitleStyle.Font.FontSize = 11;
                        subTitleStyle.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;

                        var colUpperStyle = XLWorkbook.DefaultStyle;
                        colUpperStyle.Font.Bold = true;
                        colUpperStyle.Border.TopBorder = XLBorderStyleValues.Thin;
                        colUpperStyle.Border.TopBorderColor = XLColor.Black;
                        colUpperStyle.Border.LeftBorder = XLBorderStyleValues.Thin;
                        colUpperStyle.Border.LeftBorderColor = XLColor.Black;
                        colUpperStyle.Border.RightBorder = XLBorderStyleValues.Thin;
                        colUpperStyle.Border.RightBorderColor = XLColor.Black;

                        var colLowerStyle = XLWorkbook.DefaultStyle;
                        colLowerStyle.Border.BottomBorder = XLBorderStyleValues.Thin;
                        colLowerStyle.Border.BottomBorderColor = XLColor.Black;
                        colLowerStyle.Border.LeftBorder = XLBorderStyleValues.Thin;
                        colLowerStyle.Border.LeftBorderColor = XLColor.Black;
                        colLowerStyle.Border.RightBorder = XLBorderStyleValues.Thin;
                        colLowerStyle.Border.RightBorderColor = XLColor.Black;

                        var box1Style = XLWorkbook.DefaultStyle;
                        box1Style.Font.Bold = true;
                        box1Style.Fill.BackgroundColor = XLColor.Yellow;
                        box1Style.Border.TopBorder = XLBorderStyleValues.Thin;
                        box1Style.Border.TopBorderColor = XLColor.Black;
                        box1Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                        box1Style.Border.BottomBorderColor = XLColor.Black;
                        box1Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                        box1Style.Border.LeftBorderColor = XLColor.Black;
                        box1Style.Border.RightBorder = XLBorderStyleValues.Thin;
                        box1Style.Border.RightBorderColor = XLColor.Black;

                        var box2Style = XLWorkbook.DefaultStyle;
                        box2Style.Border.TopBorder = XLBorderStyleValues.Thin;
                        box2Style.Border.TopBorderColor = XLColor.Black;
                        box2Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                        box2Style.Border.BottomBorderColor = XLColor.Black;
                        box2Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                        box2Style.Border.LeftBorderColor = XLColor.Black;
                        box2Style.Border.RightBorder = XLBorderStyleValues.Thin;
                        box2Style.Border.RightBorderColor = XLColor.Black;

                        #endregion

                        #region Header

                        var row = 1;
                        var col = 1;
                        var merge = 8;
                        ws.Cell(row, 1).Value = "รายงานใบงานค้างซ่อม";
                        ws.Cell(row, 1).DataType = XLDataType.Text;
                        ws.Range(row, 1, row, merge).Merge().Style = titleStyle;
                        row++;
                        // Row 2
                        ws.Cell(row, 1).Value = $"ประเภท : {(string.Join(",",byType.Select(x => x.Key).ToList()))}";
                        ws.Cell(row, 1).DataType = XLDataType.Text;
                        ws.Range(row, 1, row, merge).Merge().Style = subTitleStyle;

                        #endregion

                        #region ColumnHeader
                        row++;

                        ws.Cell(row, col).Value = "No";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colUpperStyle;
                        col++;
                        ws.Cell(row, col).Value = "Item";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colUpperStyle;
                        col++;
                        ws.Cell(row, col).Value = "Description";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colUpperStyle;
                        col++;
                        ws.Cell(row, col).Value = "Require Date";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colUpperStyle;
                        col++;
                        ws.Cell(row, col).Value = "Response Date";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colUpperStyle;
                        col++;
                        ws.Cell(row, col).Value = "Plan Date";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colUpperStyle;
                        col++;
                        ws.Cell(row, col).Value = "Remark";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colUpperStyle;
                        col++;
                        ws.Cell(row, col).Value = "OverDay";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colUpperStyle;

                        row++;
                        col = 1;
                        ws.Cell(row, col).Value = "เลขที่";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colLowerStyle;
                        col++;
                        ws.Cell(row, col).Value = "รหัสเครื่อง";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colLowerStyle;
                        col++;
                        ws.Cell(row, col).Value = "รายละเอียดอาการเสีย";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colLowerStyle;
                        col++;
                        ws.Cell(row, col).Value = "วันที่แจ้งซ่อม";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colLowerStyle;
                        col++;
                        ws.Cell(row, col).Value = "วันที่ตอบรับในงาน";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colLowerStyle;
                        col++;
                        ws.Cell(row, col).Value = "วันที่กำหนดเสร็จ";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colLowerStyle;
                        col++;
                        ws.Cell(row, col).Value = "หมายเหตุจากซ่อมบำรุง";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colLowerStyle;
                        col++;
                        ws.Cell(row, col).Value = "ระยะเวลา";
                        ws.Cell(row, col).DataType = XLDataType.Text;
                        ws.Cell(row, col).Style = colLowerStyle;
                        #endregion

                        // New Row
                        row++;
                        var count = 1;
                        var dateNow = DateTime.Today;
                        foreach (var typeMain in byType.OrderBy(x => x.Key))
                        {
                            ws.Cell(row, 1).Value = $"{typeMain.Key}";
                            ws.Cell(row, 1).DataType = XLDataType.Text;
                            ws.Range(row, 1, row, merge).Merge().Style = box1Style;

                            // new row
                            row++;
                            foreach (var req in typeMain.OrderBy(x => x.RequireDate))
                            {
                                col = 1;
                                // No
                                ws.Cell(row, col).Value = count;
                                // ItemNo
                                col++;
                                ws.Cell(row, col).Value = $"{ req.ItemCode } / {req.ItemName}";
                                // Description
                                col++;
                                ws.Cell(row, col).Value = req.Description;
                                // Require Date
                                col++;
                                ws.Cell(row, col).Value = req.RequireDate;
                                // Response Date
                                col++;
                                ws.Cell(row, col).Value = req.MaintenanceApply;
                                // Plan Date
                                col++;
                                ws.Cell(row, col).Value = req.PlanEndDate;
                                // Remark
                                col++;
                                ws.Cell(row, col).Value = req.Remark;
                                // OverDay
                                var overD = req.PlanEndDate == null ? 0 : (req.PlanEndDate - dateNow)?.Days;
                                col++;
                                ws.Cell(row, col).Value = req.PlanEndDate == null ? 0 : overD;
                                // Set Style
                                ws.Range(row, 1, row, merge).Style = box2Style;
                                // Set Number format
                                ws.Range(row, 1, row, 1).Style.NumberFormat.SetNumberFormatId((int)XLPredefinedFormat.Number.General);
                                ws.Range(row, 1, row, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                                ws.Range(row, 4, row, 6).Style.NumberFormat.SetNumberFormatId((int)XLPredefinedFormat.DateTime.DayMonthAbbrYear2WithDashes);
                                ws.Range(row, 8, row, 8).Style.NumberFormat.Format = "_(* #,##0.00_);_(* -#,##0.00;_(* \" - \"??_);_(@_)";
                                // Red line
                                if (overD < 0)
                                    ws.Range(row, 1, row, merge).Style.Font.FontColor = XLColor.Red;

                                // Row
                                row++;
                                count++;
                            }
                            
                        }

                        ws.SheetView.FreezeRows(4);

                        wb.Worksheet(1).Columns().AdjustToContents();
                        wb.SaveAs(memory);

                    }

                    memory.Position = 0;
                    return File(memory, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "StockOnHand.xlsx");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Has error {ex.ToString()}");
            }

            return NoContent();
        }

        #region template
        /*
         public async Task<IActionResult> MaintenanceWaitingTemp([FromBody] OptionRequireMaintenace option)
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
                                    selector: x => new RequireMaintenance
                                    {
                                        RequireDate = x.RequireDate,
                                        ItemId = x.ItemId,
                                        RequireMaintenanceId = x.RequireMaintenanceId,
                                        MaintenanceApply = x.MaintenanceApply,
                                        RequireEmp = x.RequireEmp,
                                        RequireStatus = x.RequireStatus,
                                        ItemMaintenance = x.ItemMaintenance == null ? null : new ItemMaintenance()
                                        {
                                            ItemMaintenanceId = x.ItemMaintenance.ItemMaintenanceId
                                        }
                                    },  // Selected
                                    predicate: expression, // Where
                                    orderBy: null, // Order
                                    include: x => x.Include(z => z.ItemMaintenance),// x => x.Include(z => z.ItemMaintenance).Include(z => z.Item.ItemType), // Include
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

                    foreach (var Data in GetData.OrderBy(x => x.ItemId))
                    {
                        var item = await this.repositoryItem.GetFirstOrDefaultAsync(
                            x => new { x.ItemCode,x.Name,TypeName = x.ItemType.Name }, x => x.ItemId == Data.ItemId,
                            null,x => x.Include(z => z.ItemType));

                        var ItemTypeName = $"{item.TypeName}";

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
                            ItemCode = $"{item.ItemCode}/{item.Name}",
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
         
        public async Task<IActionResult> ScheduleWithRequireTemp([FromBody] OptionItemMaintananceSchedule Schedule)
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
                            ListItem = new Dictionary<string, List<ScheduleRequireSubViewModel>>()
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
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }
            return BadRequest(new { message });
        }
        */
        #endregion

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
