using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using VipcoMaintenance.Helpers;
using VipcoMaintenance.Models.Machines;
using VipcoMaintenance.Models.Maintenances;
using VipcoMaintenance.Services;
using VipcoMaintenance.Services.EmailServices;
using VipcoMaintenance.Services.ExcelExportServices;

namespace VipcoMaintenance
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                    .AddJsonOptions(option =>
                    {
                        option.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                        option.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                    });
            // Add AutoMap
            AutoMapper.Mapper.Reset();
            services.AddAutoMapper(typeof(Startup));

            // Add AppSettings
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);
            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            // Authentication
            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            // Setting up CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder => builder.AllowAnyOrigin()
                                      .AllowAnyHeader()
                                      .AllowAnyMethod());
            });
            // Add DI
            services.AddScoped<IUserService, UserService>();
            // Excel Export service
            services.AddExcelExport();
            // Email Sender services
            services.AddEmailSender();
            // Change AddDbContextPool if EF Core 2.1
            services.AddDbContextPool<MaintenanceContext>(option =>
                option.UseSqlServer(Configuration.GetConnectionString("MaintenanceConnection")))
                    .AddDbContextPool<MachineContext>(option =>
                option.UseSqlServer(Configuration.GetConnectionString("MachineConnection")));
            // Add service
            services.AddTransient(typeof(IRepositoryMaintenance<>), typeof(RepositoryMaintenance<>))
               .AddTransient(typeof(IRepositoryMachine<>), typeof(RepositoryMachine<>))
               .AddTransient(typeof(IRepositoryMachineMk2<>), typeof(RepositoryMachineMk2<>))
               .AddTransient(typeof(IRepositoryMaintenanceMk2<>), typeof(RepositoryMaintenanceMk2<>));
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {

            string pathBase = Configuration.GetSection("Hosting")["PathBase"];
            if (string.IsNullOrEmpty(pathBase) == false)
                app.UsePathBase(pathBase);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // Shows UseCors with named policy.
            app.UseCors("AllowAllOrigins");
            app.UseAuthentication();
            // app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                    spa.Options.StartupTimeout = new System.TimeSpan(0, 0, 120);
                }
            });
        }
    }
}
