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
using Microsoft.AspNetCore.Authorization;

namespace VipcoMaintenance.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class EmployeeController : GenericMachineController<Employee>
    {
        private readonly IMapper mapper;

        public EmployeeController(IRepositoryMachineMk2<Employee> repo,
            IMapper map) : base(repo) {
            this.mapper = map;
        }
    }
}
