using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.ViewModels;

namespace VipcoMaintenance.Services
{
    public interface IRepositoryDapper<Entity> where Entity : class
    {
        Task<Entity> GetFirstEntity(SqlCommandViewModel sqlCommand, int timeout = 60);
        Task<Entity2> GetFirstEntity<Entity2>(SqlCommandViewModel sqlCommand, int timeout = 60);
        Task<List<Entity>> GetListEntites<Parameter>(string SqlCommand, Parameter parameter,int timeout = 60);
        Task<List<Entity>> GetListEntites(SqlCommandViewModel sqlCommand, int timeout = 60);
        Task<List<Entities>> GetListEntites<Entities>(SqlCommandViewModel sqlCommand, int timeout = 60);
        Task<List<Entity>> GetListEntites(string SqlCommand, int timeout = 60);
        Task<ReturnViewModel<Entity>> GetListEntitesAndTotalRow<Parameter>(string SqlCommand, Parameter parameter, int timeout = 60);
        Task<ReturnViewModel<Entity>> GetEntitiesAndTotal<Parameter>(SqlCommandViewModel sqlCommand, Parameter parameter, int timeout = 60);
        Task<bool> ExecuteReturnNoResult(string SqlCommand, int timeout = 60);
        Task<bool> ExecuteReturnNoResult(SqlCommandViewModel SqlCommand, int timeout = 60);
        Task<bool> ExecuteReturnNoResult<Parameter>(string SqlCommand, Parameter parameter, int timeout = 60);
        Task<ReturnViewModel<Entities>> GetEntitiesAndTotal<Parameter, Entities>(SqlCommandViewModel sqlCommand, Parameter parameter, int timeout = 60);
    }
}
