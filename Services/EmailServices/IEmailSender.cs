using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.ViewModels;

namespace VipcoMaintenance.Services.EmailServices
{
    public interface IEmailSender
    {
        Task<bool> SendMail(EmailViewModel email);

        bool IsValidEmail(string strIn);
    }
}
