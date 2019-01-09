using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using VipcoMaintenance.Helpers;
using VipcoMaintenance.Models.Machines;
using VipcoMaintenance.ViewModels;
using System.Threading.Tasks;

namespace VipcoMaintenance.Services
{
    public class UserService:IUserService
    {
        // users hardcoded for simplicity, store in a db with hashed passwords in production applications
        private readonly AppSettings AppSettings;
        private readonly MachineContext Context;
        private readonly IMapper Mapper;

        public UserService(IOptions<AppSettings> appSettings,MachineContext context,IMapper mapper)
        {
            this.AppSettings = appSettings.Value;
            this.Context = context;
            this.Mapper = mapper;
        }

        public UserViewModel Authenticate(string username, string password)
        {
            var user = this.Context.User
                .Include(x => x.EmpCodeNavigation)
                .AsNoTracking().FirstOrDefault(x => x.UserName == username && x.PassWord == password);

            // return null if user not found
            if (user == null)
                return null;

            var userVM = this.Mapper.Map<User, UserViewModel>(user);

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(AppSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userVM.UserId.ToString())
                }),
                Expires = DateTime.Now.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            userVM.Token = tokenHandler.WriteToken(token);

            // remove password before returning
            userVM.PassWord = null;

            return userVM;
        }

        public async Task<UserViewModel> AuthenticateAsync(string username, string password)
        {
            var user = await this.Context.User
                                .Include(x => x.EmpCodeNavigation)
                                .AsNoTracking()
                                .FirstOrDefaultAsync(x => x.UserName == username && x.PassWord == password);

            // return null if user not found
            if (user == null)
                return null;

            var userVM = this.Mapper.Map<User, UserViewModel>(user);

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(AppSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userVM.UserId.ToString()),
                }),
                Expires = DateTime.Now.AddMinutes(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            userVM.Token = tokenHandler.WriteToken(token);

            // remove password before returning
            userVM.PassWord = null;

            return userVM;
        }
    }
}
