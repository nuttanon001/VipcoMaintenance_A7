using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.Services.ExcelExportServices
{
    public static class ExcelExportServiceCollectionExtensions
    {
        public static IServiceCollection AddExcelExport(this IServiceCollection services)
        {
            services.AddSingleton<HtmlDocumentService>();
            services.AddSingleton<ExcelWorkBookService>();
            services.AddScoped<IHelperService, HelperService>();

            return services;
        }
    }
}
