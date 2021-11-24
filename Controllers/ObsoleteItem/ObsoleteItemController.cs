using AutoMapper;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VipcoMaintenance.Helper;
using VipcoMaintenance.Models.Machines;
using VipcoMaintenance.Models.Maintenances;
using VipcoMaintenance.Services;
using VipcoMaintenance.Services.ExcelExportServices;
using VipcoMaintenance.ViewModels;
using VipcoMaintenance.ViewModels.Items;

namespace VipcoMaintenance.Controllers.ItemCancel
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ObsoleteItemController : GenericController<ObsoleteItem>
    {
        // Repository
        private readonly IRepositoryMaintenanceMk2<Item> repositoryItem;

        private readonly IRepositoryMaintenanceMk2<ObsoleteItemHasAttach> repositoryHasAttach;
        private readonly IRepositoryMachineMk2<AttachFile> repositoryAttach;
        private readonly IRepositoryDapper<ObsoleteItemViewModel> dapper;

        // IHost
        private readonly IHostingEnvironment hosting;

        // Help
        private readonly ExcelWorkBookService bookService;

        // GET: api/ItemHasCancel
        public ObsoleteItemController(IRepositoryMaintenanceMk2<ObsoleteItem> repo,
            IRepositoryMaintenanceMk2<Item> repoItem,
            IRepositoryMaintenanceMk2<ObsoleteItemHasAttach> repoHasAttach,
            IRepositoryMachineMk2<AttachFile> repoAttach,
            IRepositoryDapper<ObsoleteItemViewModel> repoDapper,
            IHostingEnvironment hosting,
            ExcelWorkBookService bookService,
            IMapper mapper) : base(repo, mapper)
        {
            //MaintenanceDatabase
            this.repositoryItem = repoItem;
            this.repositoryHasAttach = repoHasAttach;
            this.dapper = repoDapper;
            // MachineDatabase
            this.repositoryAttach = repoAttach;
            // Ihost
            this.hosting = hosting;
            // Helper
            this.bookService = bookService;
        }

        #region Private

        private readonly Func<DateTime, DateTime, string> CalcLiftTime = (sDate, eDate) =>
        {
            if (eDate > sDate)
            {
                var difference = eDate.Subtract(sDate);
                var age = DateTime.MinValue + difference;
                return $"{age.Year - 1} ปี {age.Month - 1} เดือน";
            }
            return $"0 ปี 0 เดือน";
        };

        #endregion Private

        // GET: api/ItemHasCancel/GetByItem/5
        [HttpGet("GetByItem")]
        public async Task<IActionResult> GetByItem(int itemId)
        {
            var message = "Data not been found.";
            try
            {
                var sqlCommand = new SqlCommandViewModel()
                {
                    SelectCommand = $@"ob.*
                                    ,im.ItemCode
                                    ,im.[Name] as [ItemName]
                                    ,im.RegisterDate
                                    ,im.Property as [SerialNumber]
                                    ,wg.GroupDesc as [WorkGroup]",
                    FromCommand = $@"[dbo].[ObsoleteItem] ob
                                    LEFT OUTER JOIN [dbo].[Item] im
                                        ON ob.ItemId = im.ItemId
                                    LEFT OUTER JOIN [VipcoMachineDataBase].[dbo].[EmployeeGroupMIS] wg
                                        ON im.GroupMis = wg.GroupMIS",
                    WhereCommand = $@"ob.ItemId = {itemId}",
                    OrderCommand = $@"ob.ObsoleteItemId DESC"
                };

                var hasData = await this.dapper.GetFirstEntity<ObsoleteItemViewModel>(sqlCommand);
                // Get lifetime
                if (hasData.RegisterDate != null && hasData.ObsoleteDate != null)
                {
                    if (hasData.RegisterDate <= hasData.ObsoleteDate)
                    {
                        hasData.Lifetime = hasData.RegisterDate != null && hasData.ObsoleteDate != null ?
                            this.CalcLiftTime(hasData.RegisterDate.Value, hasData.ObsoleteDate.Value.DateTime) : "0 ปี 0 เดือน";
                    }
                }
                return new JsonResult(hasData, this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }
            return BadRequest(new { message });
        }

        // GET: api/ItemHasCancel/GetKeyNumber/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasData = await this.repository.GetFirstOrDefaultAsync
                (x => new ObsoleteItemViewModel()
                {
                    Approve1 = x.Approve1,
                    Approve1Date = x.Approve1Date,
                    Approve1NameThai = x.Approve1NameThai,
                    Approve2 = x.Approve2,
                    Approve2Date = x.Approve2Date,
                    Approve2NameThai = x.Approve2NameThai,
                    ApproveToObsolete = x.ApproveToObsolete,
                    ApproveToFix = x.ApproveToFix,
                    ObsoleteDate = x.ObsoleteDate,
                    ObsoleteNo = x.ObsoleteNo,
                    ComplateBy = x.ComplateBy,
                    ComplateByNameThai = x.ComplateByNameThai,
                    CreateDate = x.CreateDate,
                    Creator = x.Creator,
                    Description = x.Description,
                    FixedAsset = x.FixedAsset,
                    ItemCode = x.Item.ItemCode,
                    ObsoleteItemId = x.ObsoleteItemId,
                    ItemName = x.Item.Name,
                    ItemId = x.ItemId,
                    Remark = x.Remark,
                    Request = x.Request,
                    RequestNameThai = x.RequestNameThai,
                    Status = x.Status,
                }, x => x.ObsoleteItemId == key, null, x => x.Include(z => z.Item));
            return new JsonResult(HasData, this.DefaultJsonSettings);
        }

        // POST: api/ItemHasCancel/GetScroll/5
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();

            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.Split(null);

            Expression<Func<ObsoleteItem, bool>> predicate = null;
            foreach (string temp in filters)
            {
                if (string.IsNullOrEmpty(temp))
                    continue;

                if (predicate == null)
                    predicate = PredicateBuilder.False<ObsoleteItem>();

                string keyword = temp.ToLower();
                predicate = predicate.Or(x => x.ObsoleteNo.ToLower().Contains(keyword) ||
                                              x.Item.ItemCode.ToLower().Contains(keyword) ||
                                              x.Item.Name.ToLower().Contains(keyword));
            }
            /*
            if (Scroll.WhereId.HasValue)
            {
                if (predicate == null)
                    predicate = PredicateBuilder.True<ItemHasCancel>();

                predicate = predicate.And(p => p.ResponsibleType == (ResponsibleType)Scroll.WhereId);
            }
            */

            if (!string.IsNullOrEmpty(Scroll.Where))
            {
                if (predicate == null)
                    predicate = PredicateBuilder.True<ObsoleteItem>();

                predicate = predicate.And(p => p.Creator == Scroll.Where);
            }

            //Order by
            Func<IQueryable<ObsoleteItem>, IOrderedQueryable<ObsoleteItem>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "CreateDate":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.CreateDate);
                    else
                        order = o => o.OrderBy(x => x.CreateDate);
                    break;

                case "CancelDate":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.ObsoleteDate);
                    else
                        order = o => o.OrderBy(x => x.ObsoleteDate);
                    break;

                case "ItemCode":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Item.ItemCode);
                    else
                        order = o => o.OrderBy(x => x.Item.ItemCode);
                    break;

                case "CancelNo":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.ObsoleteNo);
                    else
                        order = o => o.OrderBy(x => x.ObsoleteNo);
                    break;

                default:
                    order = o => o.OrderByDescending(x => x.ObsoleteDate);
                    break;
            }

            var QueryData = await this.repository.GetToListAsync(
                                    selector: x => new ObsoleteItemViewModel
                                    {
                                        ObsoleteNo = x.ObsoleteNo,
                                        ObsoleteItemId = x.ObsoleteItemId,
                                        ItemName = x.Item.Name,
                                        ItemCode = x.Item.ItemCode,
                                        RequestNameThai = x.RequestNameThai,
                                        Status = x.Status,
                                    },  // Selected
                                    predicate: predicate, // Where
                                    orderBy: order, // Order
                                    include: x => x.Include(z => z.Item), // Include
                                    skip: Scroll.Skip ?? 0, // Skip
                                    take: Scroll.Take ?? 50); // Take

            // Get TotalRow
            Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);
            //var mapDatas = new List<OverTimeMasterViewModel>();
            //foreach (var item in QueryData)
            //{
            //    var MapItem = this.mapper.Map<OverTimeMaster, OverTimeMasterViewModel>(item);
            //    mapDatas.Add(MapItem);
            //}

            return new JsonResult(new ScrollDataViewModel<ObsoleteItem>(Scroll, QueryData), this.DefaultJsonSettings);
        }

        // POST: api/ItemHasCancel/GetSchedule/5
        [HttpPost("GetSchedule")]
        public async Task<IActionResult> GetSchedule([FromBody] ScrollViewModel Scroll)
        {
            var message = "Data not been found.";
            try
            {
                //Expression<Func<ObsoleteItem, bool>> predicate = x => x.Status != StatusObsolete.Cancel;
                var predicate = PredicateBuilder.True<ObsoleteItem>();

                if (Scroll.WhereId.HasValue)
                    predicate = predicate = x => x.Status == (StatusObsolete)Scroll.WhereId;
                else
                    predicate = predicate = x => x.Status != StatusObsolete.Cancel;

                if (Scroll.SDate.HasValue)
                    predicate = predicate.And(x => x.ObsoleteDate.Value.Date >= Scroll.SDate.Value.Date);

                if (Scroll.EDate.HasValue)
                    predicate = predicate.And(x => x.ObsoleteDate.Value.Date <= Scroll.EDate.Value.Date);

                if (Scroll != null)
                {
                    // Filter
                    var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                        : Scroll.Filter.Split(null);
                    foreach (string temp in filters)
                    {
                        if (string.IsNullOrEmpty(temp))
                            continue;
                        if (predicate == null)
                            predicate = PredicateBuilder.False<ObsoleteItem>();

                        string keyword = temp.ToLower();
                        predicate = predicate.And(x => x.ObsoleteNo.ToLower().Contains(keyword) ||
                                                      x.Item.ItemCode.ToLower().Contains(keyword) ||
                                                      x.Item.Name.ToLower().Contains(keyword));
                    }

                    // Option
                    // WhereId filter itemId

                    // Where filter DocNo
                    //if (string.IsNullOrEmpty(Scroll.Where))
                    //{
                    //    if (predicate == null)
                    //        predicate = PredicateBuilder.True<ItemHasCancel>();

                    //    predicate = predicate.And(p => p.CancelNo.Contains(Scroll.Where));
                    //}

                    Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate);
                }
                else
                    Scroll.TotalRow = await this.repository.GetLengthWithAsync();

                var hasData = await this.repository.GetToListAsync(
                        x => new ObsoleteItemViewModel
                        {
                            ObsoleteNo = x.ObsoleteNo ?? "",
                            ItemCode = x.Item.ItemCode,
                            ItemName = x.Item.Name,
                            ItemId = x.ItemId,
                            ObsoleteItemId = x.ObsoleteItemId,
                            ObsoleteDate = x.ObsoleteDate.Value.Date,
                            CreateDate = x.CreateDate,
                            Status = x.Status,
                        },
                        predicate, x => x.OrderByDescending(z => z.ObsoleteDate),
                        z => z.Include(x => x.Item), Scroll.Skip ?? 0, Scroll.Take ?? 50
                    );

                if (hasData.Any())
                {
                    var dataTable = new List<ObsoleteItemScheduleViewModel>();

                    foreach (var mainItem in hasData.GroupBy(x => x.ObsoleteDate).OrderByDescending(x => x.Key))
                    {
                        var newData = new ObsoleteItemScheduleViewModel()
                        {
                            ObsoleteDate = mainItem.Key.Value.Date
                        };

                        foreach (var subItem in mainItem)
                        {
                            newData.ObsoleteItems.Add(new ObsoleteItemViewModel
                            {
                                ObsoleteNo = subItem.ObsoleteNo,
                                ObsoleteItemId = subItem.ObsoleteItemId,
                                ItemId = subItem.ItemId,
                                ItemName = subItem.ItemName,
                                ItemCode = subItem.ItemCode,
                                Status = subItem.Status
                            });
                        }

                        dataTable.Add(newData);
                    }

                    if (dataTable.Any())
                    {
                        return new JsonResult(
                            new ScrollDataViewModel<ObsoleteItemScheduleViewModel>(Scroll, dataTable), this.DefaultJsonSettings);
                    }
                }
                else
                {
                    return NoContent();
                }
            }
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { message });
        }

        // POST: api/ItemHasCancel/
        [HttpPost]
        public override async Task<IActionResult> Create([FromBody] ObsoleteItem record)
        {
            // Set date for CrateDate Entity
            if (record == null)
                return BadRequest();
            // +7 Hour
            // record = this.helper.AddHourMethod(record);

            if (record.GetType().GetProperty("CreateDate") != null)
                record.GetType().GetProperty("CreateDate").SetValue(record, DateTime.Now);

            var RunNumber = (await this.repository.GetLengthWithAsync(x => x.ObsoleteDate.Value.Year == record.ObsoleteDate.Value.Year)) + 1;
            record.ObsoleteNo = $"{record.ObsoleteDate.Value.ToString("yy")}-{RunNumber.ToString("000")}";

            if (await this.repository.AddAsync(record) == null)
                return BadRequest();

            if (record.ItemId.HasValue)
            {
                // Change item status
                var hasItem = await this.repositoryItem.GetFirstOrDefaultAsync(x => x, x => x.ItemId == record.ItemId);
                hasItem.CancelDate = record.ObsoleteDate != null ? record.ObsoleteDate.Value.DateTime : DateTime.Now;
                hasItem.ItemStatus = ItemStatus.Cancel;
                hasItem.ModifyDate = DateTime.Now;
                hasItem.Modifyer = record.Creator;

                await this.repositoryItem.UpdateAsync(hasItem, hasItem.ItemId);
            }

            return new JsonResult(record, this.DefaultJsonSettings);
        }

        // PUT: api/ItemHasCancel/5
        [HttpPut]
        public override async Task<IActionResult> Update(int key, [FromBody] ObsoleteItem record)
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
            if (await this.repository.UpdateAsync(record, key) == null)
                return BadRequest();

            if (record.ItemId.HasValue)
            {
                // Change item status
                var hasItem = await this.repositoryItem.GetFirstOrDefaultAsync(x => x, x => x.ItemId == record.ItemId);
                if (hasItem.ItemStatus != ItemStatus.Cancel)
                {
                    hasItem.ItemStatus = ItemStatus.Cancel;
                    hasItem.ModifyDate = DateTime.Now;
                    hasItem.Modifyer = record.Creator;
                    hasItem.CancelDate = record.ObsoleteDate != null ? record.ObsoleteDate.Value.DateTime : DateTime.Now;

                    await this.repositoryItem.UpdateAsync(hasItem, hasItem.ItemId);
                }
            }

            return new JsonResult(record, this.DefaultJsonSettings);
        }

        // PUT: api/ItemHasCancel/UpdateStatus/5
        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdateStatus(int key, [FromBody] ObsoleteItem obsolete)
        {
            var message = "Data not been found.";
            try
            {
                var hasData = await this.repository
                    .GetFirstOrDefaultAsync(z => z, z => z.ObsoleteItemId == key);

                if (hasData != null)
                {
                    hasData.Status = obsolete.Status;
                    hasData.ApproveToFix = obsolete.ApproveToFix;
                    hasData.ModifyDate = DateTime.Now;
                    hasData.Modifyer = obsolete.Modifyer;

                    if (await this.repository.UpdateAsync(hasData, key) == null)
                        return BadRequest();

                    return new JsonResult(hasData, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { message });
        }

        // PUT: api/ItemHasCancel/GetReport/5
        [HttpGet("GetReport")]
        public async Task<IActionResult> ObsoleteItemGetReport(int key)
        {
            var message = $"Data not been found.";
            try
            {
                if (key > 0)
                {
                    var hasData = await this.dapper.GetFirstEntity<ObsoleteItemViewModel>(new SqlCommandViewModel
                    {
                        SelectCommand = $@" ob.ObsoleteItemId,
                                            ob.Status,
                                            ob.ObsoleteNo,
                                            '( ' + ob.Approve1NameThai + ' )' AS [Approve1NameThai],
                                            ob.Approve2NameThai,
                                            ob.[Description],
                                            ob.FixedAsset,
                                            im.ItemCode,
                                            im.[Name] AS [ItemName],
                                            im.RegisterDate,
                                            ob.ObsoleteDate,
                                            '( ' + ob.RequestNameThai + ' )' AS [RequestNameThai],
                                            ob.Remark,
                                            ob.ApproveToFix,
                                            ob.ApproveToObsolete,
                                            im.Property AS [SerialNumber],
                                            wg.GroupDesc AS [WorkGroup]",
                        FromCommand = $@"[dbo].[ObsoleteItem] ob
                                            LEFT OUTER JOIN [dbo].[Item] im
                                                ON ob.ItemId = im.ItemId
                                            LEFT OUTER JOIN [VipcoMachineDataBase].[dbo].[EmployeeGroupMIS] wg
                                                ON im.GroupMis = wg.GroupMIS",
                        WhereCommand = $@"ob.ObsoleteItemId = {key}"
                    });

                    if (hasData != null)
                    {
                        if (hasData.Status == StatusObsolete.ApproveLevel3)
                        {
                            await this.dapper.ExecuteReturnNoResult(new SqlCommandViewModel
                            {
                                UpdateCommand = $@" [dbo].[ObsoleteItem]",
                                SelectCommand = $@" [Status] = 7",
                                WhereCommand = $@" [ObsoleteItemId] = {key}"
                            });
                        }

                        var imageAddress = "";
                        var AttachIds = await this.repositoryHasAttach.GetFirstOrDefaultAsync
                            (x => x.AttachFileId, x => x.ObsoleteItemId == key,
                             x => x.OrderByDescending(z => z.ObsoleteItemId));
                        if (AttachIds != null)
                        {
                            var DataAttach = await this.repositoryAttach.GetFirstOrDefaultAsync
                                (x => x, x => x.AttachFileId == AttachIds);

                            imageAddress = DataAttach != null ? DataAttach.FileAddress : "";
                            imageAddress = imageAddress.Replace("/maintenance", "");
                        }

                        // Calculate lift time
                        hasData.Lifetime = hasData.RegisterDate != null && hasData.ObsoleteDate != null ?
                            this.CalcLiftTime(hasData.RegisterDate.Value, hasData.ObsoleteDate.Value.DateTime) : "0 ปี 0 เดือน";

                        var memory = new MemoryStream();
                        using (var wb = this.bookService.Create(this.hosting.WebRootPath + "/reports/VFW-MTN-002Rv01.xlsx"))
                        {
                            var ws = wb.Worksheet(1);

                            // Set Image
                            if (!string.IsNullOrEmpty(imageAddress))
                            {
                                var image = ws.AddPicture(this.hosting.WebRootPath + imageAddress)
                                            .MoveTo(ws.Cell("C18").CellBelow(), 2, 2)
                                            .WithSize(255, 155); // size for production server only
                                                                 // .WithSize(320, 200); // size for development servcer only
                            }

                            ws.Cell(32, "K").Value = hasData.ApproveToFix.HasValue ? (hasData.ApproveToFix.Value ? "P" : "") : "";
                            ws.Cell(34, "K").Value = hasData.ApproveToObsolete.HasValue ? (hasData.ApproveToObsolete.Value ? "P" : "") : "";

                            foreach (var hField in hasData.GetType().GetProperties())
                            {
                                string name = hField.Name; // Get string name
                                var value = hField.GetValue(hasData, null);

                                var ignore = new List<string>() {
                                    "Approve1", "Approve1Date" ,
                                    "Request" , "ApproveToFix" ,
                                    "ApproveToObsolete"
                                };

                                if (ignore.Contains(name))
                                    continue;

                                if (value is DateTimeOffset && value != null)
                                {
                                    DateTimeOffset temp = (DateTimeOffset)value;
                                    value = $"'{temp.ToString("dd / MMM / ")}" + (temp.Year < 2550 ? (temp.Year + 543).ToString() : temp.ToString("yyyy"));
                                }
                                else if (value is DateTime && value != null)
                                {
                                    DateTime temp = (DateTime)value;
                                    value = $"'{temp.ToString("dd / MMM / ")}" + (temp.Year < 2550 ? (temp.Year + 543).ToString() : temp.ToString("yyyy"));
                                }
                                else if (value is double && value != null)
                                {
                                    double temp = (double)value;
                                    value = string.Format("{0:#,##0.00}", temp);
                                }

                                var filter = $"data:{name}";
                                var cell = ws.Search(filter, CompareOptions.Ordinal).ToList();
                                cell.ForEach(item =>
                                {
                                    if (item != null)
                                    {
                                        item.Value = value ?? "";
                                        item.DataType = XLDataType.Text;
                                    }
                                });

                                // var protection = ws.Protect("12365478");
                                // ws.Rows().AdjustToContents();
                                ws.SheetView.View = XLSheetViewOptions.PageBreakPreview;
                                // Print CenterHorizontally
                                ws.PageSetup.CenterHorizontally = true;
                                wb.SaveAs(memory);
                            }
                        }

                        memory.Position = 0;
                        return File(memory, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "export.xlsx");
                    }
                }
            }
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { message });
        }

        [HttpPost("GetSummanyReport")]
        public async Task<IActionResult> ObsoleteItemGetSummanyReport([FromBody] ScrollViewModel condition)
        {
            var message = $"Data not been found.";

            try
            {
                if (condition.SDate.HasValue)
                {
                    var hasData = await this.dapper.GetListEntites<ObsoleteReportVM>(new SqlCommandViewModel()
                    {
                        SelectCommand = $@"ROW_NUMBER() OVER(ORDER BY [OB].[ObsoleteItemId] ASC) AS No
                                    ,[I].[Name]
                                    ,[I].[Description]
                                    ,[I].[Brand]
                                    ,[I].[Model]
                                    ,[I].[RegisterDate]
                                    ,[I].[ItemCode]
                                    ,[I].[Property]
                                    ,[OB].[ObsoleteNo]
                                    ,[OB].[ObsoleteDate]
                                    ,[OB].[Description] AS [ObDescription]",
                        FromCommand = $@"[dbo].[ObsoleteItem] OB
                                    LEFT OUTER JOIN [dbo].[Item] AS [I]
                                        ON [I].[ItemId] = [OB].[ItemId]",
                        WhereCommand = $@"[OB].[Status] = 7
                                        AND [OB].[ObsoleteDate] >= '{condition.SDate.Value.ToString("yyyy-MM-dd")}'
                                        {(condition.EDate != null ? $"AND [OB].[ObsoleteDate] <= '{condition.EDate.Value.ToString("yyyy-MM-dd")}'" : "")}"
                    });

                    if (hasData.Any())
                    {
                        var memory = new MemoryStream();
                        using (var workbook = this.bookService.Create(this.hosting.WebRootPath + "/reports/VFW-MTN-001-1.xlsx"))
                        {
                            var workSheet = workbook.Worksheet(1);
                            //สรุปรายการขออนุมัติจำหน่ายยกเลิกใช้งานเครื่องมือ  เครื่องจักร   ประจำเดือน _________
                            workSheet.Cell(1, 2).Value = $"สรุปรายการขออนุมัติจำหน่ายยกเลิกใช้งานเครื่องมือ เครื่องจักร ตั้งแต่ \"{condition.SDate?.ToString("dd MMM yy")}\" ถึง \"{condition.EDate?.ToString("dd MMM yy") ?? DateTime.Today.ToString("dd MMM yy")}\"";
                            // 1st 24
                            // 2nd 19
                            var rowNumber = 6;

                            #region Style

                            workSheet.Range(6, 1, rowNumber, 15).Style.Font.FontName = "AngsanaUPC";
                            workSheet.Range(6, 1, rowNumber, 15).Style.Font.FontSize = 11;

                            var bbStyle = workbook.Style;
                            bbStyle.Border.TopBorder = XLBorderStyleValues.Thin;
                            bbStyle.Border.TopBorderColor = XLColor.Black;

                            bbStyle.Border.LeftBorder = XLBorderStyleValues.Thin;
                            bbStyle.Border.LeftBorderColor = XLColor.Black;

                            bbStyle.Border.RightBorder = XLBorderStyleValues.Thin;
                            bbStyle.Border.RightBorderColor = XLColor.Black;

                            bbStyle.Border.BottomBorder = XLBorderStyleValues.Thin;
                            bbStyle.Border.BottomBorderColor = XLColor.Black;

                            bbStyle.Font.FontName = "AngsanaUPC";
                            bbStyle.Font.FontSize = 10;

                            #endregion

                            // Body
                            #region Body

                            foreach (var item in hasData)
                            {
                                if (item == null)
                                    continue;

                                workSheet.Cell(rowNumber, 1).Value = item.No ?? 0;
                                workSheet.Cell(rowNumber, 1).Style = bbStyle;
                                workSheet.Cell(rowNumber, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                                workSheet.Cell(rowNumber, 2).Value = $"{(string.IsNullOrEmpty(item.Name) ? "" : item.Name)} {(string.IsNullOrEmpty(item.Description) ? "" : item.Description)}";
                                workSheet.Range(rowNumber, 2, rowNumber, 4).Merge().Style = bbStyle;

                                workSheet.Cell(rowNumber, 5).Value = string.IsNullOrEmpty(item.Brand) ? "" : item.Brand;
                                workSheet.Cell(rowNumber, 5).Style = bbStyle;

                                workSheet.Cell(rowNumber, 6).Value = string.IsNullOrEmpty(item.Model) ? "" : item.Model;
                                workSheet.Cell(rowNumber, 6).Style = bbStyle;

                                var rDate = item.RegisterDate != null && item.RegisterDate < DateTime.Now && item.RegisterDate > DateTime.MinValue ? item.RegisterDate : new DateTime(1950, 01, 01);

                                workSheet.Cell(rowNumber, 7).Value = rDate;
                                workSheet.Cell(rowNumber, 7).Style = bbStyle;
                                workSheet.Cell(rowNumber, 7).Style.NumberFormat.SetNumberFormatId((int)XLPredefinedFormat.DateTime.DayMonthYear4WithSlashes);
                                if (rDate.Value.Year == 1950)
                                {
                                    workSheet.Cell(rowNumber, 7).Style.Font.FontColor = XLColor.Red;
                                    workSheet.Cell(rowNumber, 7).Style.Font.Bold = true;
                                }

                                workSheet.Cell(rowNumber, 8).Value = string.IsNullOrEmpty(item.ItemCode) ? "" : item.ItemCode;
                                workSheet.Cell(rowNumber, 8).Style = bbStyle;

                                workSheet.Cell(rowNumber, 9).Value = string.IsNullOrEmpty(item.Property) ? "" : item.Property;
                                workSheet.Cell(rowNumber, 9).Style = bbStyle;

                                workSheet.Cell(rowNumber, 10).Value = string.IsNullOrEmpty(item.ObsoleteNo) ? "" : item.ObsoleteNo;
                                workSheet.Cell(rowNumber, 10).Style = bbStyle;

                                var oDate = item.ObsoleteDate != null && item.ObsoleteDate <= DateTime.Now ? item.ObsoleteDate : new DateTime(1950, 01, 01);
                                workSheet.Cell(rowNumber, 11).Value = oDate;
                                workSheet.Cell(rowNumber, 11).Style = bbStyle;
                                workSheet.Cell(rowNumber, 11).Style.NumberFormat.SetNumberFormatId((int)XLPredefinedFormat.DateTime.DayMonthYear4WithSlashes);
                                if (oDate.Value.Year == 1950)
                                {
                                    workSheet.Cell(rowNumber, 11).Style.Font.FontColor = XLColor.Red;
                                    workSheet.Cell(rowNumber, 11).Style.Font.Bold = true;
                                }

                                workSheet.Cell(rowNumber, 12).Value = "";
                                workSheet.Cell(rowNumber, 12).Style = bbStyle;

                                /*
                                workSheet.Cell(rowNumber, 13).AddToNamed("Mybb").Value = item.RegisterDate != null && item.ObsoleteDate != null ?
                                    this.CalcLiftTime(item.RegisterDate.Value, item.ObsoleteDate.Value.DateTime) : "0 ปี 0 เดือน";
                                */

                                var sAge = item.RegisterDate != null && item.ObsoleteDate != null ?
                                    this.CalcLiftTime(item.RegisterDate.Value, item.ObsoleteDate.Value.DateTime) : "0 ปี 0 เดือน";

                                workSheet.Cell(rowNumber, 13).Value = sAge;
                                workSheet.Cell(rowNumber, 13).Style = bbStyle;

                                workSheet.Cell(rowNumber, 14).Value = string.IsNullOrEmpty(item.ObDescription) ? "" : item.ObDescription;
                                workSheet.Range(rowNumber, 14, rowNumber, 15).Merge().Style = bbStyle;

                                rowNumber++;
                            }

                            #endregion

                            // Footer
                            #region Footer

                            rowNumber++;
                            workSheet.Cell(rowNumber, 1).Value = "จัดทำโดย :";
                            workSheet.Cell(rowNumber, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            workSheet.Cell(rowNumber, 6).Value = "ตรวจสอบโดย :";
                            workSheet.Cell(rowNumber, 6).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            workSheet.Cell(rowNumber, 11).Value = "ผู้อนุมัติโดย :";
                            workSheet.Cell(rowNumber, 11).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

                            rowNumber++;
                            workSheet.Cell(rowNumber, 2).Value = "(";
                            workSheet.Cell(rowNumber, 2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                            workSheet.Cell(rowNumber, 2).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            workSheet.Cell(rowNumber, 2).Style.Border.BottomBorderColor = XLColor.Black;

                            workSheet.Cell(rowNumber, 3).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            workSheet.Cell(rowNumber, 3).Style.Border.BottomBorderColor = XLColor.Black;

                            workSheet.Cell(rowNumber, 4).Value = ")";
                            workSheet.Cell(rowNumber, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            workSheet.Cell(rowNumber, 4).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            workSheet.Cell(rowNumber, 4).Style.Border.BottomBorderColor = XLColor.Black;

                            workSheet.Cell(rowNumber, 7).Value = "(";
                            workSheet.Cell(rowNumber, 7).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                            workSheet.Cell(rowNumber, 7).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            workSheet.Cell(rowNumber, 7).Style.Border.BottomBorderColor = XLColor.Black;

                            workSheet.Cell(rowNumber, 8).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            workSheet.Cell(rowNumber, 8).Style.Border.BottomBorderColor = XLColor.Black;

                            workSheet.Cell(rowNumber, 9).Value = ")";
                            workSheet.Cell(rowNumber, 9).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            workSheet.Cell(rowNumber, 9).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            workSheet.Cell(rowNumber, 9).Style.Border.BottomBorderColor = XLColor.Black;

                            workSheet.Cell(rowNumber, 12).Value = "(";
                            workSheet.Cell(rowNumber, 12).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
                            workSheet.Cell(rowNumber, 12).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            workSheet.Cell(rowNumber, 12).Style.Border.BottomBorderColor = XLColor.Black;

                            workSheet.Cell(rowNumber, 13).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            workSheet.Cell(rowNumber, 13).Style.Border.BottomBorderColor = XLColor.Black;

                            workSheet.Cell(rowNumber, 14).Value = ")";
                            workSheet.Cell(rowNumber, 14).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            workSheet.Cell(rowNumber, 14).Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            workSheet.Cell(rowNumber, 14).Style.Border.BottomBorderColor = XLColor.Black;

                            rowNumber++;
                            workSheet.Range(rowNumber, 2, rowNumber, 4).Merge();
                            workSheet.Range(rowNumber, 2, rowNumber, 4).Value = "หัวหน้างาน / เจ้าหน้าที่สโตร์เครื่องมือ";
                            workSheet.Range(rowNumber, 2, rowNumber, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                            workSheet.Range(rowNumber, 7, rowNumber, 9).Merge();
                            workSheet.Range(rowNumber, 7, rowNumber, 9).Value = "หัวหน้าหน่วยงาน";
                            workSheet.Range(rowNumber, 7, rowNumber, 9).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                            workSheet.Range(rowNumber, 12, rowNumber, 14).Merge();
                            workSheet.Range(rowNumber, 12, rowNumber, 14).Value = "ผู้บริหาร / ผู้จัดการ";
                            workSheet.Range(rowNumber, 12, rowNumber, 14).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                            #endregion

                            // var protection = ws.Protect("12365478");
                            // ws.Rows().AdjustToContents();

                            // workSheet.Columns(1, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                            
                            /*
                            workSheet.Columns(7, 7).Style.NumberFormat.Format = "dd/MM/yyyy";
                            workSheet.Columns(11, 11).Style.NumberFormat.Format = "dd/MM/yyyy";
                            */

                            workSheet.SheetView.View = XLSheetViewOptions.PageBreakPreview;
                            // Print CenterHorizontally
                            workSheet.PageSetup.CenterHorizontally = true;
                            workbook.SaveAs(memory);
                        }

                        memory.Position = 0;
                        return File(memory, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "export.xlsx");
                    }
                }
            }
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { message });
        }

        #region ATTACH

        // GET: api/ItemHasCancel/GetAttach/5
        [HttpGet("GetAttach")]
        public async Task<IActionResult> GetAttach(int key)
        {
            var AttachIds = await this.repositoryHasAttach.GetToListAsync(
                x => x.AttachFileId, x => x.ObsoleteItemId == key, x => x.OrderByDescending(z => z.ObsoleteItemHasAttachId));
            if (AttachIds != null)
            {
                var DataAttach = await this.repositoryAttach.GetToListAsync(x => x, x => AttachIds.Contains(x.AttachFileId));
                return new JsonResult(DataAttach, this.DefaultJsonSettings);
            }

            return NotFound(new { Error = "Attatch not been found." });
        }

        // POST: api/ItemHasCancel/PostAttach/5/Someone
        [HttpPost("PostAttach"), DisableRequestSizeLimit]
        public async Task<IActionResult> PostAttact2(int key, string CreateBy)
        {
            string Message = "";
            try
            {
                var files = Request.Form.Files;
                long size = files.Sum(f => f.Length);

                // full path to file in temp location
                var filePath1 = Path.GetTempFileName();

                foreach (var formFile in files)
                {
                    string FileName = Path.GetFileName(formFile.FileName).ToLower();
                    // create file name for file
                    string FileNameForRef = $"{DateTime.Now.ToString("ddMMyyhhmmssfff")}{ Path.GetExtension(FileName).ToLower()}";
                    // full path to file in temp location
                    var filePath = Path.Combine(this.hosting.WebRootPath + "/files", FileNameForRef);

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

                    await this.repositoryHasAttach.AddAsync(new ObsoleteItemHasAttach()
                    {
                        AttachFileId = returnData.AttachFileId,
                        CreateDate = DateTime.Now,
                        Creator = CreateBy ?? "Someone",
                        ObsoleteItemId = key,
                        FileType = FileType.Image
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

        // DELETE: api/ItemHasCancel/DeleteAttach/5
        [HttpDelete("DeleteAttach")]
        public async Task<IActionResult> DeleteAttach(string AttachFileString)
        {
            if (!string.IsNullOrEmpty(AttachFileString) && AttachFileString.IndexOf(",") != -1)
            {
                var AttachFileIds = AttachFileString.Split(',').ToList();
                foreach (var AttachFiles in AttachFileIds)
                {
                    if (int.TryParse(AttachFiles, out int AttachFileId))
                    {
                        var AttachFile = await this.repositoryAttach.GetAsync(AttachFileId);
                        if (AttachFile != null)
                        {
                            var filePath = Path.Combine(this.hosting.WebRootPath + AttachFile.FileAddress);
                            FileInfo delFile = new FileInfo(filePath);

                            if (delFile.Exists)
                                delFile.Delete();
                            // Condition
                            var requestHasAttach = await this.repositoryHasAttach.GetFirstOrDefaultAsync(
                                x => x, x => x.AttachFileId == AttachFile.AttachFileId);

                            if (requestHasAttach != null)
                                this.repositoryHasAttach.Delete(requestHasAttach.ObsoleteItemHasAttachId);

                            // remove attach
                            return new JsonResult(
                                await this.repositoryAttach.DeleteAsync(AttachFile.AttachFileId),
                                this.DefaultJsonSettings);
                        }
                    }
                }
            }
            return NotFound(new { Error = "Not found attach file." });
        }

        #endregion ATTACH
    }
}