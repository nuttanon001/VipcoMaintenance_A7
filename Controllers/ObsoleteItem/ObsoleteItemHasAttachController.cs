using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Authorization;

using System;
using System.IO;
using System.Linq;
using System.Dynamic;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using VipcoMaintenance.Helper;
using VipcoMaintenance.Services;
using VipcoMaintenance.ViewModels;
using VipcoMaintenance.Models.Maintenances;
using VipcoMaintenance.Services.EmailServices;
using VipcoMaintenance.Services.ExcelExportServices;

using AutoMapper;
using ClosedXML.Excel;

namespace VipcoMaintenance.Controllers.ItemCancel
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObsoleteItemHasAttachController : GenericController<ObsoleteItemHasAttach>
    {
        // GET: api/ItemCancelHasAttach
        public ObsoleteItemHasAttachController(IRepositoryMaintenanceMk2<ObsoleteItemHasAttach> repo,
            IMapper mapper) : base(repo, mapper)
        { }

        [HttpGet("GetByMaster")]
        public async Task<IActionResult> GetByMaster(int key)
        {
            var message = "Data not been found.";

            try
            {
                if (key > 0)
                {
                    var hasData = await this.repository
                        .GetToListAsync(x => x, x => x.ObsoleteItemId == key);
                }
            }
            catch(Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }
            return BadRequest(new { message });
        }
    }
}
