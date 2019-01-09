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
using AutoMapper;

namespace VipcoMaintenance.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class EmployeeGroupMisController : GenericMachineController<EmployeeGroupMis>
    {
        private readonly IMapper mapper;
        public EmployeeGroupMisController(IRepositoryMachineMk2<EmployeeGroupMis> repo,
            IMapper map):base(repo) {
            this.mapper = map;
        }
       
    }
}
