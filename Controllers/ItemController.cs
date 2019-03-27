using AutoMapper;
using ClosedXML.Excel;
using ClosedXML.Excel.Drawings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Helper;
using VipcoMaintenance.Models.Machines;
using VipcoMaintenance.Models.Maintenances;
using VipcoMaintenance.Services;
using VipcoMaintenance.Services.ExcelExportServices;
using VipcoMaintenance.ViewModels;

namespace VipcoMaintenance.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ItemController : GenericController<Item>
    {
        // IRepository
        private readonly IRepositoryMachineMk2<Employee> repositoryEmp;
        private readonly IRepositoryMachineMk2<EmployeeGroupMis> repositoryGroupMis;
        private readonly IRepositoryMaintenanceMk2<ItemType> repositoryType;
        private readonly IRepositoryMaintenanceMk2<RequireMaintenance> repositoryRequireMaintenance;
        private readonly ExcelWorkBookService excelWorkBookService;
        private readonly IHelperService helperService;
        private readonly IHostingEnvironment hosting;

        public ItemController(IRepositoryMaintenanceMk2<Item> repo,
            IRepositoryMachineMk2<Employee> repoEmp,
            IRepositoryMachineMk2<EmployeeGroupMis> repoGroupMis,
            IRepositoryMaintenanceMk2<ItemType> repoType,
            IRepositoryMaintenanceMk2<RequireMaintenance> repoRequireMain,
            ExcelWorkBookService excelWorkBook,
            IHelperService helper,
            IHostingEnvironment hosting,
            IMapper mapper) : base(repo, mapper)
        {
            // Repository Machine
            this.repositoryEmp = repoEmp;
            this.repositoryGroupMis = repoGroupMis;
            // Repository Maintenance
            this.repositoryType = repoType;
            this.repositoryRequireMaintenance = repoRequireMain;
            // Helper
            this.excelWorkBookService = excelWorkBook;
            this.helperService = helper;
            // Host
            this.hosting = hosting;
        }

        #region Private

        private async Task<List<ItemViewModel>> GetData(ScrollViewModel Scroll)
        {
            if (Scroll != null)
            {
                // Filter
                var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                    : Scroll.Filter.Split(null);

                var predicate = PredicateBuilder.False<Item>();

                foreach (string temp in filters)
                {
                    string keyword = temp.ToLower().Trim();
                    predicate = predicate.Or(x => x.Branch.Name.ToLower().Contains(keyword) ||
                                                x.Description.ToLower().Contains(keyword) ||
                                                x.ItemCode.ToLower().Contains(keyword) ||
                                                x.Name.ToLower().Contains(keyword) ||
                                                x.ItemType.Name.ToLower().Contains(keyword));
                }

                if (Scroll.WhereId.HasValue)
                {
                    if (Scroll.WhereId > 0)
                        predicate = predicate.And(x => x.ItemTypeId == Scroll.WhereId);
                }

                if (!string.IsNullOrEmpty(Scroll.Where))
                    predicate = predicate.And(p => p.Creator == Scroll.Where);

                if (Scroll.SDate.HasValue)
                    predicate = predicate.And(p => p.RegisterDate.Value.Date >= Scroll.SDate.Value.Date);

                if (Scroll.EDate.HasValue)
                    predicate = predicate.And(p => p.RegisterDate.Value.Date <= Scroll.EDate.Value.Date);

                //Order by
                Func<IQueryable<Item>, IOrderedQueryable<Item>> order;
                // Order
                switch (Scroll.SortField)
                {
                    case "ItemCode":
                        if (Scroll.SortOrder == -1)
                            order = o => o.OrderByDescending(x => x.ItemCode);
                        else
                            order = o => o.OrderBy(x => x.ItemCode);
                        break;

                    case "Name":
                        if (Scroll.SortOrder == -1)
                            order = o => o.OrderByDescending(x => x.Name);
                        else
                            order = o => o.OrderBy(x => x.Name);
                        break;

                    case "ItemTypeString":
                        if (Scroll.SortOrder == -1)
                            order = o => o.OrderByDescending(x => x.ItemType.Name);
                        else
                            order = o => o.OrderBy(x => x.ItemType.Name);
                        break;

                    default:
                        order = o => o.OrderBy(x => x.ItemCode);
                        break;
                }

                var QueryData = (await this.repository.GetToListAsync(
                                        selector: x => new ItemViewModel
                                        {
                                            ItemId = x.ItemId,
                                            ItemCode = x.ItemCode,
                                            Name = x.Name,
                                            Model = x.Model,
                                            EmpResponsible = x.EmpResponsible,
                                            GroupMis = x.GroupMis,
                                        },  // Selected
                                        predicate: predicate, // Where
                                        orderBy: order, // Order
                                        include: null, // Include
                                        skip: Scroll.Skip ?? 0, // Skip
                                        take: Scroll.Take ?? 50)).ToList(); // Take

                // Get TotalRow
                Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);

                var listGroups = QueryData.Select(x => x.GroupMis).Distinct().ToList();
                var listEmps = QueryData.Select(x => x.EmpResponsible).Distinct().ToList();

                var groupMis = await this.repositoryGroupMis.GetToListAsync(x => new { x.GroupMis,x.GroupDesc },x => listGroups.Contains(x.GroupMis));
                var emps = await this.repositoryEmp.GetToListAsync(x => new { x.EmpCode,x.NameThai },x => listEmps.Contains(x.EmpCode));
                // var mapDatas = new List<ItemViewModel>();
                foreach (var item in QueryData)
                {
                    if (!string.IsNullOrEmpty(item.GroupMis))
                        item.GroupMisString = groupMis.FirstOrDefault(x => x.GroupMis == item.GroupMis).GroupDesc ?? "-";
                    if (!string.IsNullOrEmpty(item.EmpResponsible))
                        item.EmpResposibleString = emps.FirstOrDefault(x => x.EmpCode == item.EmpResponsible).NameThai ?? "-";
                    // mapDatas.Add(MapItem);
                }

                return QueryData;
            }

            return null;
        }

        #endregion

        // GET: api/Item/5
        [HttpGet("GetKeyNumber")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasItem = await this.repository.GetFirstOrDefaultAsync(
                z => new ItemViewModel
                {
                    BranchId = z.BranchId,
                    BranchString = z.Branch.Name,
                    Brand = z.Brand,
                    Name = z.Name,
                    CancelDate = z.CancelDate,
                    CreateDate = z.CreateDate,
                    Creator = z.Creator,
                    Description = z.Description,
                    EmpResponsible =z.EmpResponsible,
                    GroupMis = z.GroupMis,
                    ItemCode = z.ItemCode,
                    ItemId = z.ItemId,
                    ItemImage = z.ItemImage,
                    ItemStatus = z.ItemStatus,
                    ItemStatusString = System.Enum.GetName(typeof(ItemStatus), z.ItemStatus),
                    ItemTypeId = z.ItemTypeId,
                    ItemTypeString = z.ItemType == null ? "-" : z.ItemType.Name,
                    Model = z.Model,
                    ModifyDate = z.ModifyDate,
                    Modifyer = z.Modifyer,
                    Property = z.Property,
                    Property2 = z.Property2,
                    Property3 = z.Property3,
                    RegisterDate = z.RegisterDate,
                }, 
                z => z.ItemId == key, null,
                z => z.Include(x => x.ItemType).Include(x => x.Branch));

            if (HasItem != null)
            {
                if (!string.IsNullOrEmpty(HasItem.EmpResponsible))
                    HasItem.EmpResposibleString = (await this.repositoryEmp.GetAsync(HasItem.EmpResponsible)).NameThai;
                if (!string.IsNullOrEmpty(HasItem.GroupMis))
                    HasItem.GroupMisString = (await this.repositoryGroupMis.GetAsync(HasItem.GroupMis)).GroupDesc ?? "-";
                HasItem.ItemImage = HasItem.ItemImage;
                return new JsonResult(HasItem, this.DefaultJsonSettings);
            }
            return BadRequest();
        }

        // GET: api/Item/ItemByGroup
        [HttpGet("ItemByGroup")]
        public async Task<IActionResult> ItemByGroup(string key)
        {
            var HasData = await this.repository.GetToListAsync(
                x => x, x => x.GroupMis == key, null,
                z => z.Include(x => x.ItemType).Include(x => x.Branch));

            if (HasData.Any())
            {
                var listData = new List<ItemViewModel>();
                foreach (var item in HasData)
                {
                    var MapData = this.mapper.Map<Item, ItemViewModel>(item);
                    if (!string.IsNullOrEmpty(MapData.GroupMis))
                        MapData.GroupMisString = (await this.repositoryGroupMis.GetAsync(MapData.GroupMis)).GroupDesc ?? "-";
                    listData.Add(MapData);
                }
                return new JsonResult(listData, this.DefaultJsonSettings);
            }
            return BadRequest();
        }

        // POST: api/Item/ItemByGroupWithScroll
        [HttpPost("ItemByGroupWithScroll")]
        public async Task<IActionResult> GetItemByGroupWithScroll([FromBody] ScrollViewModel Scroll)
        {
            var Message = "";
            try
            {
                if (Scroll == null)
                {
                    return BadRequest();
                }

                var predicate = PredicateBuilder.False<Item>();
                //var QueryData = this.repository.GetAllAsQueryable()
                //                                .Select(x => new Item
                //                                {
                //                                    ItemId = x.ItemId,
                //                                    GroupMis = x.GroupMis ?? "-"
                //                                }).AsQueryable();
                if (Scroll.WhereId.HasValue)
                {
                    if (Scroll.WhereId > 0)
                        predicate = predicate.And(x => x.ItemTypeId == Scroll.WhereId);
                }
                if (!string.IsNullOrEmpty(Scroll.Where))
                    predicate = predicate.And(x => x.Creator == Scroll.Where);

                var HasData = (await this.repository.GetToListAsync(x => x, predicate)).ToList();
                var QueryData2 = HasData.GroupBy(x => x.GroupMis).Select(x => new ItemByGroupViewModel()
                {
                    GroupMis = string.IsNullOrEmpty(x.Key) ? "-" : x.Key,
                    GroupMisString = string.IsNullOrEmpty(x.Key) ? "ไม่ระบุ" : this.repositoryGroupMis.GetFirstOrDefault(z => z, z => z.GroupMis == x.Key).GroupDesc,
                    ItemCount = x.Count()
                }).ToList();

                // Filter
                var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                    : Scroll.Filter.ToLower().Split(null);

                foreach (var keyword in filters)
                {
                    QueryData2 = QueryData2.Where(x => x.GroupMis.ToLower().Contains(keyword) ||
                                                       x.GroupMisString.ToLower().Contains(keyword)).ToList();
                }

                // Order
                switch (Scroll.SortField)
                {
                    case "GroupMisString":
                        if (Scroll.SortOrder == -1)
                            QueryData2 = QueryData2.OrderByDescending(e => e.GroupMis).ToList();
                        else
                            QueryData2 = QueryData2.OrderBy(e => e.GroupMis).ToList();
                        break;

                    case "ItemCount":
                        if (Scroll.SortOrder == -1)
                            QueryData2 = QueryData2.OrderByDescending(e => e.ItemCount).ToList();
                        else
                            QueryData2 = QueryData2.OrderBy(e => e.ItemCount).ToList();
                        break;

                    default:
                        QueryData2 = QueryData2.OrderBy(e => e.GroupMis).ToList();
                        break;
                }
                // Get TotalRow
                Scroll.TotalRow = QueryData2.Count();
                // Skip Take
                QueryData2 = QueryData2.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50).ToList();
                // var HasData = await QueryData2.ToListAsync();
                return new JsonResult(new ScrollDataViewModel<ItemByGroupViewModel>(Scroll, QueryData2), this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { Error = Message });
        }

        // POST: api/Item/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();

            var Message = "";
            try
            {
                var MapDatas = await this.GetData(Scroll);
                return new JsonResult(new ScrollDataViewModel<ItemViewModel>(Scroll, MapDatas), this.DefaultJsonSettings);
            }
            catch (Exception ex)
            {
                Message = $"{ex.ToString()}";
            }
            return BadRequest(new { Message });
        }

        // POST: api/Item/GetScroll
        [HttpPost("GetReport")]
        public async Task<IActionResult> GetReport([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();

            var Message = "";
            try
            {
                var MapDatas = await this.GetData(Scroll);
                if (MapDatas.Any())
                {
                    var table = new DataTable();
                    //Adding the Columns
                    table.Columns.AddRange(new DataColumn[]
                    {
                        new DataColumn("Code", typeof(string)),
                        new DataColumn("Name", typeof(string)),
                        new DataColumn("Model",typeof(string)),
                        new DataColumn("Brand",typeof(string)),
                        new DataColumn("S/N",typeof(string)),
                        new DataColumn("Branch",typeof(string)),
                        new DataColumn("Employee",typeof(string)),
                        new DataColumn("Group",typeof(string)),
                        new DataColumn("Register",typeof(string)),
                        new DataColumn("Cancel",typeof(string)),
                    });

                    //Adding the Rows
                    foreach (var item in MapDatas)
                    {
                        table.Rows.Add(
                                    item.ItemCode,
                                    item.Name,
                                    item.Model,
                                    item.Brand,
                                    item.Property,
                                    item.BranchString,
                                    item.EmpResposibleString,
                                    item.GroupMisString,
                                    item.RegisterDate == null ? "-" : item.RegisterDate.Value.ToString("dd/MM/yy"),
                                    item.CancelDate == null ? "-" : item.CancelDate.Value.ToString("dd/MM/yy")
                                );
                    }

                    return File(this.helperService.CreateExcelFile(table, "ItemMaintenance"),
                     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ItemMaintenance_Report.xlsx");

                }
            }
            catch (Exception ex)
            {
                Message = $"{ex.ToString()}";
            }
            return BadRequest(new { Message });
        }

        // Put: api/Item/ChangeGroupOfItem
        [HttpPut("ChangeGroupOfItem")]
        public async Task<IActionResult> ChangeGroupOfItem(string Group, string ByEmp, [FromBody] List<Item> records)
        {
            if (records != null)
            {
                List<int> excluse = new List<int>();
                // Update group
                foreach (var record in records)
                {
                    record.ModifyDate = DateTime.Now;
                    record.Modifyer = ByEmp;
                    record.GroupMis = Group;
                    if (await this.repository.UpdateAsync(record, record.ItemId) == null)
                        excluse.Add(record.ItemId);
                }

                var dbItems = await this.repository.GetToListAsync(x => x, x => x.GroupMis == Group);
                if (dbItems != null)
                {
                    // Remove group if not pick
                    foreach (var dbItem in dbItems)
                    {
                        if (excluse.Any(x => x == dbItem.ItemId))
                            continue;

                        if (!records.Any(x => x.ItemId == dbItem.ItemId))
                        {
                            // If item of this group don't pick
                            dbItem.ModifyDate = DateTime.Now;
                            dbItem.Modifyer = ByEmp;
                            dbItem.GroupMis = "";

                            await this.repository.UpdateAsync(dbItem, dbItem.ItemId);
                        }
                    }
                }

                return new JsonResult(new ItemByGroupViewModel()
                {
                    GroupMis = Group,
                    ItemCount = records.Count
                }, this.DefaultJsonSettings);
            }
            return BadRequest();
        }

        [HttpPost("ItemHistories")]
        public async Task<IActionResult> ItemHistories([FromBody] ItemHistoryOptionViewModel Option)
        {
            var message = "Data not been found.";

            try
            {
                if (Option != null)
                {
                    var HasData = await this.repositoryRequireMaintenance.GetToListAsync(x => new ItemHistorieViewModel
                    {
                        Fail = x.Description,
                        Fix = x.ItemMaintenance == null ? "-" : x.ItemMaintenance.Description,
                        Date = x.RequireDate,
                        Remark = x.ItemMaintenance == null ? "-" : x.ItemMaintenance.Remark,
                        ItemMaintenanceId = x.ItemMaintenance == null ? 0 : x.ItemMaintenance.ItemMaintenanceId
                    },
                                                x => x.ItemId == Option.ItemId &&
                                                     x.RequireStatus != RequireStatus.Cancel,
                                                x => x.OrderByDescending(z => z.RequireDate),
                                                x => x.Include(z => z.ItemMaintenance));
                    if (HasData.Any())
                        return new JsonResult(HasData, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }
            return BadRequest(new { message });
        }

        [HttpGet("ItemHistoriesExport")]
        public async Task<IActionResult> ItemHistoriesExport(int? key)
        {
            var message = "Data not been found.";

            try
            {
                if (key != null && key > 0)
                {
                    var dbItem = await this.repository.GetFirstOrDefaultAsync(
                        x => x, x => x.ItemId == key, null, x => x.Include(z => z.Branch));

                    if (dbItem != null)
                    {
                        var HasData = await this.repositoryRequireMaintenance
                            .GetToListAsync(x => new ItemHistorieViewModel
                            {
                                Fail = x.Description,
                                Fix = x.ItemMaintenance == null ? "-" : x.ItemMaintenance.Description,
                                Date = x.RequireDate,
                                ItemMaintenanceId = x.ItemMaintenance == null ? 0 : x.ItemMaintenance.ItemMaintenanceId,
                                Remark = x.ItemMaintenance == null ? "-" : x.ItemMaintenance.Remark
                            }, x => x.ItemId == dbItem.ItemId && x.RequireStatus != RequireStatus.Cancel,
                            x => x.OrderByDescending(z => z.RequireDate),
                            x => x.Include(z => z.ItemMaintenance));

                        var mapItem = this.mapper.Map<Item, ItemViewModel>(dbItem);
                        var memory = new MemoryStream();
                        var templateFolder = this.hosting.WebRootPath + "/reports/";
                        var fileExcel = templateFolder + $"ItemHistorie.xlsx";


                        if (!string.IsNullOrEmpty(dbItem.ItemImage))
                        {
                            try
                            {
                                var base64 = "";
                                if (dbItem.ItemImage.Contains("data:image/jpeg;base64,"))
                                    base64 = dbItem.ItemImage.Remove(0, 23);
                                else if (dbItem.ItemImage.Contains("data:image/png;base64,"))
                                    base64 = dbItem.ItemImage.Remove(0, 22);

                                var imgBytes = Convert.FromBase64String(base64);
                                using (var imageFile = new FileStream(templateFolder + $"template.png", FileMode.Create))
                                {
                                    imageFile.Write(imgBytes, 0, imgBytes.Length);
                                    imageFile.Flush();
                                }
                            }
                            finally
                            {}
                        }

                        using (var wb = this.excelWorkBookService.Create(fileExcel))
                        {
                            var ws = wb.Worksheet(1);
                            // Image
                            if (!string.IsNullOrEmpty(dbItem.ItemImage))
                            {
                                var image1 = ws.AddPicture(templateFolder + $"template.png")
                                         .MoveTo(ws.Cell("A3").CellBelow(),0,5)
                                         .WithSize(450, 228);
                                         //.Scale(0.5); // optional: resize picture
                            }
                            // Set data to excel
                            foreach (var field in mapItem.GetType().GetProperties()) // Loop through fields
                            {
                                string name = field.Name; // Get string name
                                var value = field.GetValue(mapItem, null);

                                if (value is DateTime && value != null)
                                {
                                    DateTime temp = (DateTime)value;
                                    value = $"'{temp.ToString("dd/MMM/")}" + (temp.Year < 2550 ? (temp.Year + 543).ToString() : temp.ToString("yyyy"));
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
                            }

                            var tableWithPeople = ws.Cell(16, 1).InsertTable(HasData.Select(x => new
                            {
                                x.Date,
                                ItemFail = x.Fail, 
                                ItemFix = x.Fix,
                                x.Remark
                            }).AsEnumerable());

                            tableWithPeople.Style.Alignment.WrapText = true;
                            tableWithPeople.Style.Font.FontName = "Angsana New";
                            tableWithPeople.Style.Font.FontSize = 14;

                            wb.SaveAs(memory);
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

    }
}