using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace VipcoMaintenance.Services.EmailServices
{
    public class SmtpClientService
    {
        private readonly EmailServerSettings Settings;

        public SmtpClientService(EmailServerSettings settings)
        {
            this.Settings = settings;
        }

        public SmtpClient Create()
        {
            return new SmtpClient(Settings.Host, Settings.Port)
            {
                UseDefaultCredentials = false,
                EnableSsl = false,
            };
        }
    }
}
