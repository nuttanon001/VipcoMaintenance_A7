﻿using System;
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
    public class BranchController : GenericController<Branch>
    {
        public BranchController(IRepositoryMaintenanceMk2<Branch> repo,
            IMapper mapper) : base(repo, mapper) {}

        // POST: api/Branch/GetScroll
        [HttpPost("GetScroll")]
        public async Task<IActionResult> GetScroll([FromBody] ScrollViewModel Scroll)
        {
            if (Scroll == null)
                return BadRequest();
            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.Split(null);

            var predicate = PredicateBuilder.False<Branch>();

            foreach (string temp in filters)
            {
                string keyword = temp;
                predicate = predicate.Or(x => x.Name.ToLower().Contains(keyword) ||
                                              x.Address.ToLower().Contains(keyword));
            }
            if (!string.IsNullOrEmpty(Scroll.Where))
                predicate = predicate.And(p => p.Creator == Scroll.Where);
            //Order by
            Func<IQueryable<Branch>, IOrderedQueryable<Branch>> order;
            // Order
            switch (Scroll.SortField)
            {
                case "Name":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Name);
                    else
                        order = o => o.OrderBy(x => x.Name);
                    break;

                case "Address":
                    if (Scroll.SortOrder == -1)
                        order = o => o.OrderByDescending(x => x.Address);
                    else
                        order = o => o.OrderBy(x => x.Address);
                    break;

                default:
                    order = o => o.OrderBy(x => x.Name);
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

            var mapDatas = new List<BranchViewModel>();
            foreach (var item in QueryData)
            {
                var MapItem = this.mapper.Map<Branch, BranchViewModel>(item);
                mapDatas.Add(MapItem);
            }

            return new JsonResult(new ScrollDataViewModel<BranchViewModel>(Scroll, mapDatas), this.DefaultJsonSettings);
        }
    }
}
