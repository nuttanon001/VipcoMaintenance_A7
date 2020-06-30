using System;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using VipcoMaintenance.Services;
using VipcoMaintenance.ViewModels;
using VipcoMaintenance.Models.Maintenances;
using AutoMapper;
using VipcoMaintenance.Helper;
using Microsoft.AspNetCore.Authorization;

namespace VipcoMaintenance.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class SparePartController : GenericController<SparePart>
    {
        private readonly IRepositoryMaintenanceMk2<MovementStockSp> repositoryMovement;
        private readonly IRepositoryDapper<SparePartViewModel> dapper;
        public SparePartController(IRepositoryMaintenanceMk2<SparePart> repo,
            IRepositoryMaintenanceMk2<MovementStockSp> repoMovement,
            IRepositoryDapper<SparePartViewModel> dap,
            IMapper mapper) :base(repo, mapper) {
            //Repository
            this.repositoryMovement = repoMovement;
            //Dapper
            this.dapper = dap;
        }

        // POST: api/SparePart/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            var message = "Data not been found.";

            try
            {
                if (Scroll != null)
                {
                    // ACC_0 ลูกหนี้ในประเทศ 113101 และ ลูกหนี้ต่างประเทศ 113201
                    string sWhere = "";
                    string sSort = "";

                    #region Where

                    // Filter
                    var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                        : Scroll.Filter.Split(null);

                    foreach (string temp in filters)
                    {
                        if (string.IsNullOrEmpty(temp))
                            continue;

                        string keyword = temp.ToLower();
                        sWhere += (string.IsNullOrEmpty(sWhere) ? " " : " AND ") +
                                                         $@"(LOWER([sp].[Name]) LIKE N'%{keyword}%'
                                                             OR LOWER([sp].[Model]) LIKE N'%{keyword}%')";
                    }

                    // Where 
                    if (!string.IsNullOrEmpty(Scroll.Where))
                    {
                        Scroll.Where = Scroll.Where.ToLower();
                        sWhere += (string.IsNullOrEmpty(sWhere) ? " " : " AND ") + $@"(LOWER([sp].[Code]) LIKE N'{Scroll.Where}%')";
                    }

                    #endregion Where

                    #region Sort

                    switch (Scroll.SortField)
                    {
                        case "Code":
                            if (Scroll.SortOrder == -1)
                                sSort = $"[sp].[Code] DESC";//QueryData = QueryData.OrderByDescending(x => x.PAYM.Pshnum0);
                            else
                                sSort = $"[sp].[Code] ASC";//QueryData = QueryData.OrderBy(x => x.PAYM.Pshnum0);
                            break;

                        case "Name":
                            if (Scroll.SortOrder == -1)
                                sSort = $"[sp].[Name] DESC";//QueryData = QueryData.OrderByDescending(x => x.PAYM.Prqdat0);
                            else
                                sSort = $"[sp].[Name] ASC";//QueryData = QueryData.OrderBy(x => x.PAYM.Prqdat0);
                            break;

                        case "Model":
                            if (Scroll.SortOrder == -1)
                                sSort = $"[sp].[Model] DESC";//QueryData = QueryData.OrderByDescending(x => x.PAYM.Pjth0);
                            else
                                sSort = $"[sp].[Model] ASC";//QueryData = QueryData.OrderBy(x => x.PAYM.Pjth0);
                            break;

                        default:
                            sSort = $"[sp].[Code] ASC,[sp].[Name] ASC";//QueryData = QueryData.OrderByDescending(x => x.PAYM.Prqdat0);
                            break;
                    }

                    #endregion Sort

                    var sqlCommnad = new SqlCommandViewModel()
                    {
                        SelectCommand = $@"	[sp].[SparePartId]
                                            ,[sp].[Code]
                                            ,[sp].[Name]
                                            ,[sp].[Model]
                                            ,SUM(
                                                CASE [ms].[MovementStatus]
                                                    WHEN 1 THEN [ms].[Quantity]
                                                    WHEN 3 THEN [ms].[Quantity]
                                                    WHEN 2 THEN [ms].[Quantity] * -1
                                                    WHEN 4 THEN [ms].[Quantity] * -1
                                                ELSE 0
                                                END
                                            ) AS [OnHand]",
                        FromCommand = $@" [dbo].[SparePart] sp
                                        LEFT OUTER JOIN [dbo].[MovementStockSp] ms
                                            ON ms.SparePartId = sp.SparePartId 
                                            AND ms.MovementStatus != 5",
                        WhereCommand = sWhere,
                        GroupCommand = $@"[sp].[SparePartId],[sp].[Name]
                                            ,[sp].[Model],[sp].[Code]",
                        OrderCommand = sSort
                    };

                    var result = await this.dapper.GetEntitiesAndTotal(sqlCommnad, new { Skip = Scroll.Skip ?? 0, Take = Scroll.Take ?? 50 });
                    var dbData = result.Entities;
                    Scroll.TotalRow = result.TotalRow;

                    return new JsonResult(new ScrollDataViewModel<SparePartViewModel>(Scroll, dbData), this.DefaultJsonSettings);
                }
            }
            catch(Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }
           
            return BadRequest(new { message });
        }

        public async Task<IActionResult> GetScrollTemp([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.Split(null);

            var predicate = PredicateBuilder.False<SparePart>();

            foreach (string temp in filters)
            {
                string keyword = temp;
                predicate = predicate.Or(x => x.Name.ToLower().Contains(keyword) ||
                                            x.Description.ToLower().Contains(keyword) ||
                                            x.Model.ToLower().Contains(keyword) ||
                                            x.Size.ToLower().Contains(keyword) ||
                                            x.Property.ToLower().Contains(keyword) ||
                                            x.Remark.ToLower().Contains(keyword));
            }
            if (!string.IsNullOrEmpty(Scroll.Where))
                predicate = predicate.And(p => p.Creator == Scroll.Where);
            //Order by
            Func<IQueryable<SparePart>, IOrderedQueryable<SparePart>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "Name":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Name);
                    else
                        order = o => o.OrderBy(x => x.Name);
                    break;

                case "Model":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Model);
                    else
                        order = o => o.OrderBy(x => x.Model);
                    break;

                default:
                    order = o => o.OrderByDescending(x => x.Name);
                    break;
            }

            var QueryData = await this.repository.GetToListAsync(
                                    selector: selected => selected,  // Selected
                                    predicate: predicate, // Where
                                    orderBy: order, // Order
                                    include: null, // Include
                                    skip: Scroll.Skip ?? 0, // Skip
                                    take: Scroll.Take ?? 50); // Take

            // Get TotalRow
            Scroll.TotalRow = await this.repository.GetLengthWithAsync(predicate: predicate);

            var mapDatas = new List<SparePartViewModel>();
            foreach (var item in QueryData)
            {
                var MapItem = this.mapper.Map<SparePart, SparePartViewModel>(item);
                MapItem.OnHand = (await this.repositoryMovement.GetToListAsync(
                                        x => x, x => x.SparePartId == MapItem.SparePartId && 
                                                x.MovementStatus != MovementStatus.Cancel))
                                           .Sum(x => x.MovementStatus == MovementStatus.AdjustIncrement ||
                                                     x.MovementStatus == MovementStatus.ReceiveStock ? x.Quantity : (x.Quantity * -1));
                mapDatas.Add(MapItem);
            }

            return new JsonResult(new ScrollDataViewModel<SparePartViewModel>(Scroll, mapDatas), this.DefaultJsonSettings);
          
        }
    }
}
