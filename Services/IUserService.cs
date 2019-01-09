using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Machines;
using VipcoMaintenance.ViewModels;

namespace VipcoMaintenance.Services
{
    public interface IUserService
    {
        UserViewModel Authenticate(string username, string password);

        Task<UserViewModel> AuthenticateAsync(string username, string password);
    }
}
