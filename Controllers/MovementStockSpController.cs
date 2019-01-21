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
using Microsoft.AspNetCore.Authorization;

namespace VipcoMaintenance.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class MovementStockSpController : GenericController<MovementStockSp>
    {
        public MovementStockSpController(IRepositoryMaintenanceMk2<MovementStockSp> repo,
            IMapper mapper):base(repo, mapper) { }
      
    }
}
