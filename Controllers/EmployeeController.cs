using System;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using VipcoMaintenance.Services;
using VipcoMaintenance.ViewModels;
using VipcoMaintenance.Models.Machines;
using VipcoMaintenance.ViewModels.Employees;

using AutoMapper;
using Newtonsoft.Json;

namespace VipcoMaintenance.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class EmployeeController : GenericMachineController<Employee>
    {
        private readonly IMapper mapper;
        private readonly IHostingEnvironment hosting;

        public EmployeeController(IRepositoryMachineMk2<Employee> repo,
            IHostingEnvironment hostingEnv,
            IMapper map) : base(repo) {
            this.mapper = map;
            this.hosting = hostingEnv;
        }

        // GET: api/User/GetAllowedEmployee
        [Authorize]
        [HttpGet("GetAllowedEmployee")]
        public async Task<IActionResult> GetAllowedEmployee(string key)
        {
            var message = "Data been not found.";
            try
            {
                string contentRootPath = this.hosting.ContentRootPath;
                var allowedEmployees = JsonConvert.DeserializeObject<List<AllowedEmployeeViewModel>>
                        (await System.IO.File.ReadAllTextAsync(contentRootPath + "/Data/allowed_emp.json"));

                if (allowedEmployees.Any())
                {
                    var hasData = allowedEmployees.FirstOrDefault(x => x.EmpCode == key);
                    if (hasData != null)
                        return new JsonResult(hasData, this.DefaultJsonSettings);
                }
            }
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { message });
        }

        // POST: api/Employee/GetAllowedEmployeeScroll
        [Authorize]
        [HttpPost("GetAllowedEmployeeScroll")]
        public async Task<IActionResult> GetAllowedEmployeeScroll([FromBody] ScrollViewModel Scroll)
        {
            string contentRootPath = this.hosting.ContentRootPath;
            // get activity code from json file
            var allowedEmployees = JsonConvert.DeserializeObject<List<AllowedEmployeeViewModel>>
                (await System.IO.File.ReadAllTextAsync(contentRootPath + "/Data/allowed_emp.json"));

            var emps = await this.repository.GetToListAsync(
                                    x => new { x.EmpCode, x.NameThai },
                                    x => allowedEmployees.Select(z => z.EmpCode).Contains(x.EmpCode));

            foreach (var item in allowedEmployees)
                item.NameThai = emps.FirstOrDefault(x => x.EmpCode == item.EmpCode)?.NameThai ?? "-";

            // Filter
            var filters = string.IsNullOrEmpty(Scroll.Filter) ? new string[] { "" }
                                : Scroll.Filter.ToLower().Split(null);

            foreach (var keyword in filters)
            {
                allowedEmployees = allowedEmployees.Where(x => x.NameThai.ToLower().Contains(keyword) ||
                                                                x.EmpCode.ToLower().Contains(keyword)).ToList();
            }

            // Order
            switch (Scroll.SortField)
            {
                case "EmpCode":
                    if (Scroll.SortOrder == -1)
                        allowedEmployees = allowedEmployees.OrderByDescending(e => e.EmpCode).ToList();
                    else
                        allowedEmployees = allowedEmployees.OrderBy(e => e.EmpCode).ToList();
                    break;

                case "NameThai":
                    if (Scroll.SortOrder == -1)
                        allowedEmployees = allowedEmployees.OrderByDescending(e => e.NameThai).ToList();
                    else
                        allowedEmployees = allowedEmployees.OrderBy(e => e.NameThai).ToList();
                    break;

                default:
                    allowedEmployees = allowedEmployees.OrderBy(e => e.EmpCode.Length)
                                                        .ThenBy(e => e.EmpCode).ToList();
                    break;
            }
            // Get TotalRow
            Scroll.TotalRow = allowedEmployees.Count();
            // Skip and Take
            allowedEmployees = allowedEmployees.Skip(Scroll.Skip ?? 0).Take(Scroll.Take ?? 50).ToList();

            return new JsonResult(new ScrollDataViewModel<AllowedEmployeeViewModel>
                (Scroll, allowedEmployees), this.DefaultJsonSettings);
        }

        // POST: api/Employee/UpdateAllowedEmployee
        [Authorize]
        [HttpPost("UpdateAllowedEmployee")]
        public async Task<IActionResult> UpdateAllowedEmployee([FromBody] AllowedEmployeeViewModel allowed)
        {
            var message = "Update allowed failed";
            try
            {
                if (allowed != null)
                {
                    string contentRootPath = this.hosting.ContentRootPath;
                    // get activity code from json file
                    var allowedEmployees = JsonConvert.DeserializeObject<List<AllowedEmployeeViewModel>>
                        (await System.IO.File.ReadAllTextAsync(contentRootPath + "/Data/allowed_emp.json"));

                    // get activity code from somchai database server
                    if (allowedEmployees.Any())
                    {
                        if (allowedEmployees.Any(x => x.EmpCode == allowed.EmpCode))
                        {
                            var index = allowedEmployees.FindIndex(x => x.EmpCode == allowed.EmpCode);
                            if (index >= 0)
                            {
                                allowedEmployees[index].EmpCode = allowed.EmpCode;
                                allowedEmployees[index].SubLevel = allowed.SubLevel;
                            }
                        }
                        else
                        {
                            allowedEmployees.Add(new AllowedEmployeeViewModel()
                            {
                                EmpCode = allowed.EmpCode,
                                SubLevel = allowed.SubLevel,
                            });
                        }

                        await System.IO.File.WriteAllTextAsync(contentRootPath + "/Data/allowed_emp.json", JsonConvert.SerializeObject(allowedEmployees));
                        return new JsonResult(allowed, this.DefaultJsonSettings);
                    }
                }
            }
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }
            return BadRequest(new { message });
        }

        // PUT: api/User/UpdateAllowedEmployee
        [Authorize]
        [HttpPut("UpdateAllowedEmployee")]
        public async Task<IActionResult> PutUpdateAllowedEmployee(string key, [FromBody] AllowedEmployeeViewModel allowed)
        {
            var message = "Data not been found.";

            try
            {
                if (!string.IsNullOrEmpty(key) && allowed != null)
                {
                    string contentRootPath = this.hosting.ContentRootPath;
                    // get activity code from json file
                    var allowedEmployees = JsonConvert.DeserializeObject<List<AllowedEmployeeViewModel>>
                        (await System.IO.File.ReadAllTextAsync(contentRootPath + "/Data/allowed_emp.json"));

                    if (allowedEmployees.Any(x => x.EmpCode == allowed.EmpCode))
                    {
                        var index = allowedEmployees.FindIndex(x => x.EmpCode == key);
                        if (index >= 0)
                        {
                            allowedEmployees[index].EmpCode = key;
                            allowedEmployees[index].NameThai = allowed.NameThai;
                            allowedEmployees[index].SubLevel = allowed.SubLevel;
                        }

                        await System.IO.File.WriteAllTextAsync(contentRootPath + "/Data/allowed_emp.json", JsonConvert.SerializeObject(allowedEmployees));
                        return new JsonResult(allowed, this.DefaultJsonSettings);
                    }
                }
            }
            catch (Exception ex)
            {
                message = $"Has error {ex.ToString()}";
            }

            return BadRequest(new { message });
        }
    }
}
