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

namespace VipcoMaintenance.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class SparePartController : GenericController<SparePart>
    {
        private readonly IRepositoryMaintenanceMk2<MovementStockSp> repositoryMovement;
        public SparePartController(IRepositoryMaintenanceMk2<SparePart> repo,
            IRepositoryMaintenanceMk2<MovementStockSp> repoMovement,
            IMapper mapper) :base(repo, mapper) {
            //Repository
            this.repositoryMovement = repoMovement;
        }

        // POST: api/SparePart/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
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
