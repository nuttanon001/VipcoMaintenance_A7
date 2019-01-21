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
    public class TypeMaintenanceController : GenericController<TypeMaintenance>
    {
        private readonly IRepositoryMaintenanceMk2<Item> repositoryItem;
        public TypeMaintenanceController(IRepositoryMaintenanceMk2<TypeMaintenance> repo,
            IRepositoryMaintenanceMk2<Item> repoItem,
            IMapper mapper):base(repo, mapper) {
            this.repositoryItem = repoItem;
        }

        // GET: api/TypeMaintenance/GetTypeMaintenanceByItem/5
        [HttpGet("GetTypeMaintenanceByItem")]
        public async Task<IActionResult> GetTypeMaintenanceByItem(int ItemId)
        {
            if (ItemId > 0)
            {
                var ItemData = await this.repositoryItem.GetFirstOrDefaultAsync(
                    x => x,x => x.ItemId.Equals(ItemId));
                if (ItemData != null)
                {
                    var QueryData = this.repository.GetToListAsync(x => x, x => x.ItemTypeId == ItemData.ItemTypeId);

                    var ListMapData = new List<TypeMaintenanceViewModel>();
                    foreach (var item in ListMapData)
                        ListMapData.Add(this.mapper.Map<TypeMaintenance, TypeMaintenanceViewModel>(item));

                    return new JsonResult(ListMapData, this.DefaultJsonSettings);
                }
                else
                {
                    var QueryData = await this.repository.GetToListAsync(x => x);
                    return new JsonResult(QueryData, this.DefaultJsonSettings);
                }
            }

            return BadRequest();
        }

        // POST: api/TypeMaintenance/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.Split(null);

            var predicate = PredicateBuilder.False<TypeMaintenance>();

            foreach (string temp in filters)
            {
                string keyword = temp;
                predicate = predicate.Or(x => x.Name.ToLower().Contains(keyword) ||
                                              x.Description.ToLower().Contains(keyword));
            }
            if (!string.IsNullOrEmpty(Scroll.Where))
                predicate = predicate.And(p => p.Creator == Scroll.Where);
            if (Scroll.WhereId.HasValue)
                predicate = predicate.And(x => x.ItemType.WorkGroupId == Scroll.WhereId);
            //Order by
            Func<IQueryable<TypeMaintenance>, IOrderedQueryable<TypeMaintenance>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "Name":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Name);
                    else
                        order = o => o.OrderBy(x => x.Name);
                    break;

                case "Description":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Description);
                    else
                        order = o => o.OrderBy(x => x.Description);
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

            var mapDatas = new List<TypeMaintenanceViewModel>();
            foreach (var item in QueryData)
            {
                var MapItem = this.mapper.Map<TypeMaintenance, TypeMaintenanceViewModel>(item);
                mapDatas.Add(MapItem);
            }

            return new JsonResult(new ScrollDataViewModel<TypeMaintenanceViewModel>(Scroll, mapDatas), this.DefaultJsonSettings);
        }
    }
}
