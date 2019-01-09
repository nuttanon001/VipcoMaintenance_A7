using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace VipcoMaintenance.Services
{
    public interface IRepositoryMachine<TEntity> where TEntity : class
    {
        TEntity Get(string TEntityId, bool option = false);
        TEntity Get(int id, bool option = false);
        Task<TEntity> GetAsync(int id, bool option = false);
        Task<TEntity> GetAsync(string TEntityId, bool option = false);
        Task<TEntity> GetAsynvWithIncludes(int id, string PkName, List<string> Includes = null);
        IQueryable<TEntity> GetAllAsQueryable();
        Task<ICollection<TEntity>> GetAllAsync(bool option = false);
        Task<ICollection<TEntity>> GetAllWithRelateAsync(Expression<Func<TEntity, bool>> match = null, bool option = false);
        Task<ICollection<TEntity>> GetAllWithConditionAndIncludeAsync(
            Expression<Func<TEntity, bool>> Condition = null, List<string> Includes = null, bool option = false);
        Task<ICollection<TEntity>> GetAllWithIncludeAsync
            (List<Expression<Func<TEntity, object>>> relates);
        Task<ICollection<TEntity>> GetAllWithInclude2Async(List<string> includes);
        Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> match, bool option = false);
        TEntity Find(Expression<Func<TEntity, bool>> match, bool option = false);
        Task<ICollection<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> match, bool option = false);
        ICollection<TEntity> FindAll(Expression<Func<TEntity, bool>> match,bool option = false);
        Task<ICollection<TEntity>> FindAllWithIncludeAsync
            (Expression<Func<TEntity, bool>> match, List<Expression<Func<TEntity, object>>> relates,
            bool option = false);
        ICollection<TEntity> FindAllWithLazyLoad
            (Expression<Func<TEntity, bool>> match,
            List<Expression<Func<TEntity, object>>> relates,
            int Skip, int Row,
            Expression<Func<TEntity, string>> order = null,
            Expression<Func<TEntity, string>> orderDesc = null);
        Task<ICollection<TEntity>> FindAllWithLazyLoadAsync
            (Expression<Func<TEntity, bool>> match,
            List<Expression<Func<TEntity, object>>> relates,
            int Skip, int Row,
            Expression<Func<TEntity, string>> order = null,
            Expression<Func<TEntity, string>> orderDesc = null);
        TEntity Add(TEntity nTEntity);
        Task<TEntity> AddAsync(TEntity nTEntity);
        Task<IEnumerable<TEntity>> AddAllAsync(IEnumerable<TEntity> nTEntityList);
        Task<TEntity> UpdateAsync(TEntity updated, int key);
        Task<TEntity> UpdateAsync(TEntity updated, string key);
        TEntity Update(TEntity updated, string key);
        TEntity Update(TEntity updated, int key);
        void Delete(int key);
        Task<int> DeleteAsync(string TEntityId);
        Task<int> DeleteAsync(int key);
        Task<int> CountAsync();
        int CountWithMatch(Expression<Func<TEntity, bool>> match);
        Task<int> CountWithMatchAsync(Expression<Func<TEntity, bool>> match);
        Task<bool> AnyDataAsync(Expression<Func<TEntity, bool>> match);
    }
}
