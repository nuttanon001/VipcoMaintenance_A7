using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace VipcoMaintenance.Services
{
    public interface IRepositoryMaintenanceMk2<TEntity> where TEntity : class
    {
        Task<TEntity> GetAsync(int id, bool option = false);
        Task<TEntity> GetAsync(string id, bool option = false);
        /// <summary>
        /// Get all entites
        /// </summary>
        /// <param name="option"></param>
        /// <returns></returns>
        Task<ICollection<TEntity>> GetAllAsync(bool option = false);
        /////////
        // New //
        /////////
        /// <summary>
        /// Gets the first or default entity based on a predicate, orderby delegate and include delegate. This method default no-tracking query.
        /// </summary>
        /// <param name="selector">The selector for projection.</param>
        /// <param name="predicate">A function to test each element for a condition.</param>
        /// <param name="orderBy">A function to order elements.</param>
        /// <param name="include">A function to include navigation properties</param>
        /// <param name="disableTracking"></param>
        /// <remarks>This method default no-tracking query.</remarks>
        TResult GetFirstOrDefault<TResult>(Expression<Func<TEntity, TResult>> selector,
                                   Expression<Func<TEntity, bool>> predicate = null,
                                   Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                   Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                   bool disableTracking = true);
        /// <summary>
        /// Gets the first or default entity based on a predicate, orderby delegate and include delegate. This method default no-tracking query.
        /// </summary>
        /// <param name="selector">The selector for projection.</param>
        /// <param name="predicate">A function to test each element for a condition.</param>
        /// <param name="orderBy">A function to order elements.</param>
        /// <param name="include">A function to include navigation properties</param>
        /// <param name="disableTracking"></param>
        /// <remarks>This method default no-tracking query.</remarks>
        Task<TResult> GetFirstOrDefaultAsync<TResult>(Expression<Func<TEntity, TResult>> selector,
                                     Expression<Func<TEntity, bool>> predicate = null,
                                     Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                     Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                     bool disableTracking = true);
        /// <summary>
        /// Gets the first or default entity based on a predicate, orderby delegate and include delegate. This method default no-tracking query.
        /// </summary>
        /// <param name="selector">The selector for projection.</param>
        /// <param name="predicate">A function to test each element for a condition.</param>
        /// <param name="orderBy">A function to order elements.</param>
        /// <param name="include">A function to include navigation properties</param>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="disableTracking"></param>
        /// <remarks>This method default no-tracking query.</remarks>
        Task<ICollection<TResult>> GetToListAsync<TResult>(Expression<Func<TEntity, TResult>> selector,
                                    Expression<Func<TEntity, bool>> predicate = null,
                                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                    int? skip = null, int? take = null,
                                    bool disableTracking = true);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="predicate">A function to test each element for a condition</param>
        /// <param name="disableTracking"></param>
        /// <returns></returns>
        Task<int> GetLengthWithAsync(Expression<Func<TEntity, bool>> predicate = null, bool disableTracking = true);
        /// <summary>
        /// Add entity to database
        /// </summary>
        /// <param name="nTEntity"></param>
        /// <returns></returns>
        TEntity Add(TEntity nTEntity);
        /// <summary>
        /// Add entity to database by async
        /// </summary>
        /// <param name="nTEntity"></param>
        /// <returns></returns>
        Task<TEntity> AddAsync(TEntity nTEntity);
        /// <summary>
        /// Add entites to database by async
        /// </summary>
        /// <param name="nTEntityList"></param>
        /// <returns></returns>
        Task<IEnumerable<TEntity>> AddAllAsync(IEnumerable<TEntity> nTEntityList);
        /// <summary>
        /// Update entity to database by key(int) of entity
        /// </summary>
        /// <param name="updated"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        Task<TEntity> UpdateAsync(TEntity updated, int key);
        /// <summary>
        /// Update entity to database by key(string) of entity
        /// </summary>
        /// <param name="updated"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        Task<TEntity> UpdateAsync(TEntity updated, string key);
        TEntity Update(TEntity updated, string key);
        TEntity Update(TEntity updated, int key);
        void Delete(int key);
        void Delete(string key);
        Task<int> DeleteAsync(int key);
        Task<int> DeleteAsync(string key);
    }
}
