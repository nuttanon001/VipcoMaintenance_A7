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
using VipcoMaintenance.Models.Machines;

namespace VipcoMaintenance.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ProjectCodeMasterController : GenericMachineController<ProjectCodeMaster>
    {
        public ProjectCodeMasterController(IRepositoryMachineMk2<ProjectCodeMaster> repo) : base(repo) { }
    }
}
