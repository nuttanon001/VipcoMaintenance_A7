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
using VipcoMaintenance.Models.Machines;
using Microsoft.AspNetCore.Authorization;

namespace VipcoMaintenance.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ItemMainHasEmployeeController : GenericController<ItemMainHasEmployee>
    {
        private readonly IRepositoryMachineMk2<Employee> repositoryEmployee;
        public ItemMainHasEmployeeController(IRepositoryMaintenanceMk2<ItemMainHasEmployee> repo,
            IRepositoryMachineMk2<Employee> repoEmp,
            IMapper mapper) :base(repo, mapper)
        {
            this.repositoryEmployee = repoEmp;
        }

        // GET: api/ItemMainHasEmployee/GetItemMainHasEmpByItemMainten/5
        [HttpGet("GetItemMainHasEmpByItemMainten")]
        public override async Task<IActionResult> Get(int key)
        {
            var HasItem = await this.repository.GetToListAsync(
                x => x, x => x.ItemMaintenanceId == key);

            if (HasItem != null)
            {
                var ListItem = new List<ItemMainHasEmployeeViewModel>();
                foreach(var Item in HasItem)
                {
                    var MapItem = this.mapper.Map<ItemMainHasEmployee, ItemMainHasEmployeeViewModel>(Item);
                    if (!string.IsNullOrEmpty(MapItem.EmpCode))
                        MapItem.ItemMainEmpString = (await this.repositoryEmployee.GetAsync(MapItem.EmpCode)).NameThai;
                    ListItem.Add(MapItem);
                }
                return new JsonResult(ListItem, this.DefaultJsonSettings);
            }
            return BadRequest();
        }

        [HttpPost("PostItems")]
        public async Task<IActionResult> PostItems (int key,[FromBody] List<ItemMainHasEmployee> Items)
        {
            if (Items == null)
                return BadRequest();

            var dbDatas = await this.repository.GetToListAsync(x => x, x => x.ItemMaintenanceId == key);
            //Removes DataBase
            foreach(var dbData in dbDatas)
            {
                if (!Items.Any(x => x.ItemMainHasEmployeeId == dbData.ItemMainHasEmployeeId))
                    await this.repository.DeleteAsync(dbData.ItemMainHasEmployeeId);
            }

            foreach(var Item in Items)
            {
                if (Item.ItemMainHasEmployeeId > 0)
                {
                    Item.ModifyDate = DateTime.Now;
                    Item.ItemMaintenanceId = key;
                    // Insert DataBase
                    await this.repository.AddAsync(Item);
                }
                else
                {
                    Item.CreateDate = DateTime.Now;
                    Item.ItemMaintenanceId = key;
                    // Update DataBase
                    await this.repository.UpdateAsync(Item, Item.ItemMainHasEmployeeId);
                }
            }

            return NoContent();
        }
    }
}
