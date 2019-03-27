using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.Services.EmailServices
{
    public static class EmailSenderServiceCollectionExtensions
    {
        public static IServiceCollection AddEmailSender(this IServiceCollection services)
        {
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddSingleton<NetworkClient>();
            services.AddSingleton<SmtpClientService>();
            services.AddScoped<MailMessageService>();
            services.AddSingleton(
                new EmailServerSettings
                (
                    host: "mail.vipco-thai.com",
                    port: 25
                ));
            return services;
        }
    }
}
