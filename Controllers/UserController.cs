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
using VipcoMaintenance.Models.Maintenances;

using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace VipcoMaintenance.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UserController : GenericMachineController<User>
    {
        #region PrivateMenbers

        private readonly IUserService userService;
        private readonly IRepositoryMaintenanceMk2<Permission> repositoryPermission;
        private readonly IMapper mapper;

        #endregion PrivateMenbers

        #region Constructor

        public UserController(IRepositoryMachineMk2<User> repo,
            IRepositoryMaintenanceMk2<Permission> repoPermission,
            IUserService user, IMapper map) : base(repo)
        {
            //Repository
            this.repositoryPermission = repoPermission;
            //Helper
            this.mapper = map;
            this.userService = user;
        }

        #endregion

        #region GET

        // GET: api/User/EmployeeAlready
        [AllowAnonymous]
        [HttpGet("EmployeeAlready")]
        public async Task<IActionResult> EmployeeAlready(string EmpCode)
        {
            Expression<Func<User, bool>> condition = u => u.EmpCode == EmpCode;
            var Result = await this.repository.AnyDataAsync(condition);
            if (Result)
                return NoContent();

            return new JsonResult(new { Result = true }, this.DefaultJsonSettings);
        }

        #endregion

        #region POST
        // POST: api/LoginName/Login
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] User login)
        {
            var Message = "Login has error.";
            try
            {
                var HasData = await this.userService.AuthenticateAsync(login.UserName, login.PassWord);

                //var HasData = await this.repository.GetAllAsQueryable()
                //                               .Include(x => x.EmpCodeNavigation)
                //                               .FirstOrDefaultAsync(m => m.UserName.ToLower() == login.UserName.ToLower() &&
                //                                                         m.PassWord.ToLower() == login.PassWord.ToLower());

                if (HasData != null)
                {
                    if (HasData.LevelUser < 3)
                    {
                        var DataPermission = await this.repositoryPermission.GetFirstOrDefaultAsync(x => x, x => x.UserId == HasData.UserId);
                        if (DataPermission != null)
                        {
                            HasData.LevelUser = DataPermission.LevelPermission;
                            HasData.SubLevel = DataPermission.SubLevel;
                        }
                        else
                        {
                            HasData.LevelUser = 1;
                            HasData.SubLevel = 0;
                        }
                    }
                    else
                        HasData.SubLevel = 2;

                    return new JsonResult(HasData, this.DefaultJsonSettings);
                }
                else
                    return NotFound(new { Error = "user or password not match" });
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }
            return NotFound(new { Error = Message });
        }


        // POST: api/User
        [AllowAnonymous]
        [HttpPost]
        public override async Task<IActionResult> Create([FromBody]User nUser)
        {
            if (nUser != null)
            {
                Expression<Func<User, bool>> condition = u => u.UserName.ToLower() == nUser.UserName.ToLower();
                if (await this.repository.AnyDataAsync(condition))
                {
                    return NotFound(new { Error = " this username was already in system." });
                }

                nUser.CreateDate = DateTime.Now;
                nUser.Creator = nUser.Creator ?? "Someone";

                return new JsonResult(await this.repository.AddAsync(nUser), this.DefaultJsonSettings);
            }
            return NotFound(new { Error = "Not found user data !!!" });
        }
        #endregion

        #region PUT
        // PUT: api/User/5
        [HttpPut("{key}")]
        public override async Task<IActionResult> Update(int key, [FromBody]User uUser)
        {
            var Message = "Not found user data.";

            try
            {
                if (uUser != null)
                {
                    uUser.ModifyDate = DateTime.Now;
                    uUser.Modifyer = uUser.Modifyer ?? "Someone";

                    var UpdateData = await this.repository.UpdateAsync(uUser, key);
                    if (UpdateData != null)
                    {
                        return new JsonResult(
                           this.mapper.Map<User, UserViewModel>(await this.repository.GetAsync(key,true)),
                           this.DefaultJsonSettings);
                    }
                }
            }
            catch (Exception ex)
            {
                Message = $"Has error {ex.ToString()}";
            }

            return NotFound(new { Error = Message });
        }
        #endregion
    }
}
