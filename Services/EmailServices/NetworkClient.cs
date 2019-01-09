using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using VipcoMaintenance.ViewModels;

namespace VipcoMaintenance.Services.EmailServices
{
    public class NetworkClient
    {
        private readonly SmtpClientService smtpClientService;

        public NetworkClient(SmtpClientService smtpClient)
        {
            this.smtpClientService = smtpClient;
        }

        public async Task<bool> SendEmail(MailMessage mailMessage)
        {
            try
            {
                using (SmtpClient client = this.smtpClientService.Create())
                {
                    await client.SendMailAsync(mailMessage);
                    return true;
                }
            }
            catch (Exception ex)
            {
                var message = $"Has error {ex.ToString()}";
            }
            return false;
        }
    }
}
