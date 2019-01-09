using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VipcoMaintenance.Models.Machines;

namespace VipcoMaintenance.Services
{
    public class RepositoryMachineMk2<TEntity> : IRepositoryMachineMk2<TEntity> where TEntity : class
    {
        #region PrivateMembers
        private readonly DbSet<TEntity> Entities;
        private readonly DbQuery<TEntity> Queries;
        private readonly MachineContext Context;
        private readonly string ErrorMessage = string.Empty;
        #endregion

        #region Constructor
        /// <summary>
        /// The contructor requires an open DataContext to work with
        /// </summary>
        /// <param name="context">An open DataContext</param>

        public RepositoryMachineMk2(MachineContext context)
        {
            this.Context = context;
            try
            {
                this.Entities = context.Set<TEntity>();
            }
            catch
            {
                this.Queries = context.Query<TEntity>();
            }
        }
        #endregion

        #region Get
        /// <summary>
        /// Returns a single object with a primary key of the provided id
        /// </summary>
        /// <remarks>Asynchronous</remarks>
        /// <param name="id">The primary key of the object to fetch</param>
        /// <param name="option">Option need lazy relation</param>
        /// <returns>A single object with the provided primary key or null</returns>
        public async Task<TEntity> GetAsync(int id, bool option = false)
        {
            var entity = await Entities.FindAsync(id);
            if (!option && entity != null)
                this.Context.Entry(entity).State = EntityState.Detached;
            return entity;
        }

        public async Task<TEntity> GetAsync(string id, bool option = false)
        {
            var entity = await Entities.FindAsync(id);
            if (!option && entity != null)
                this.Context.Entry(entity).State = EntityState.Detached;
            return entity;
        }
        /// <summary>
        /// Gets the first or default entity based on a predicate, orderby delegate and include delegate. This method default no-tracking query.
        /// </summary>
        /// <param name="selector">The selector for projection.</param>
        /// <param name="predicate">A function to test each element for a condition.</param>
        /// <param name="orderBy">A function to order elements.</param>
        /// <param name="include">A function to include navigation properties</param>
        /// <param name="disableTracking"><c>True</c> to disable changing tracking; otherwise, <c>false</c>. Default to <c>true</c>.</param>
        /// <returns>An <see cref="IPagedList{TEntity}"/> that contains elements that satisfy the condition specified by <paramref name="predicate"/>.</returns>
        /// <remarks>This method default no-tracking query.</remarks>
        public TResult GetFirstOrDefault<TResult>(Expression<Func<TEntity, TResult>> selector,
                                             Expression<Func<TEntity, bool>> predicate = null,
                                             Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                             Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                             bool disableTracking = true)
        {
            IQueryable<TEntity> query = this.Entities ?? this.Queries.AsQueryable();
            if (disableTracking)
                query = query.AsNoTracking();

            if (include != null)
                query = include(query);

            if (predicate != null)
                query = query.Where(predicate);

            if (orderBy != null)
                return orderBy(query).Select(selector).FirstOrDefault();
            else
                return query.Select(selector).FirstOrDefault();
        }
        /// <summary>
        /// Gets the first or default entity based on a predicate, orderby delegate and include delegate. This method default no-tracking query.
        /// </summary>
        /// <param name="selector">The selector for projection.</param>
        /// <param name="predicate">A function to test each element for a condition.</param>
        /// <param name="orderBy">A function to order elements.</param>
        /// <param name="include">A function to include navigation properties</param>
        /// <param name="disableTracking"><c>True</c> to disable changing tracking; otherwise, <c>false</c>. Default to <c>true</c>.</param>
        /// <returns>An <see cref="IPagedList{TEntity}"/> that contains elements that satisfy the condition specified by <paramref name="predicate"/>.</returns>
        /// <remarks>This method default no-tracking query.</remarks>
        public async Task<TResult> GetFirstOrDefaultAsync<TResult>(Expression<Func<TEntity, TResult>> selector,
                                     Expression<Func<TEntity, bool>> predicate = null,
                                     Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                     Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                     bool disableTracking = true)
        {
            IQueryable<TEntity> query = this.Entities ?? this.Queries.AsQueryable();
            if (disableTracking)
                query = query.AsNoTracking();

            if (include != null)
                query = include(query);

            if (predicate != null)
                query = query.Where(predicate);

            if (orderBy != null)
                return await orderBy(query).Select(selector).FirstOrDefaultAsync();
            else
                return await query.Select(selector).FirstOrDefaultAsync();
        }
        /// <summary>
        /// Gets the first or default entity based on a predicate, orderby delegate and include delegate. This method default no-tracking query.
        /// </summary>
        /// <param name="selector">The selector for projection.</param>
        /// <param name="predicate">A function to test each element for a condition.</param>
        /// <param name="orderBy">A function to order elements.</param>
        /// <param name="include">A function to include navigation properties</param>
        /// <param name="skip">How many skip data from database</param>
        /// <param name="take">How many take data from database</param>
        /// <param name="disableTracking"><c>True</c> to disable changing tracking; otherwise, <c>false</c>. Default to <c>true</c>.</param>
        /// <remarks>This method default no-tracking query.</remarks>
        public async Task<ICollection<TResult>> GetToListAsync<TResult>(Expression<Func<TEntity, TResult>> selector,
                                    Expression<Func<TEntity, bool>> predicate = null,
                                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                    int? skip = null, int? take = null,
                                    bool disableTracking = true)
        {
            IQueryable<TEntity> query = this.Entities ?? this.Queries.AsQueryable();
            if (disableTracking)
                query = query.AsNoTracking();

            if (include != null)
                query = include(query);

            if (predicate != null)
                query = query.Where(predicate);

            if (orderBy != null)
                query = orderBy(query);

            if (skip != null && take != null)
                query = query.Skip(skip.Value).Take(take.Value);

            return await query.Select(selector).ToListAsync();
        }
        /// <summary>
        /// Get length of list
        /// </summary>
        /// <param name="predicate"> A function to test each element for a condition.</param>
        /// <param name="disableTracking"></param>
        /// <returns></returns>
        public async Task<int> GetLengthWithAsync(Expression<Func<TEntity, bool>> predicate = null, bool disableTracking = true)
        {
            IQueryable<TEntity> query = this.Entities ?? this.Queries.AsQueryable();
            if (disableTracking)
                query = query.AsNoTracking();
            if (predicate != null)
                query = query.Where(predicate);

            return await query.CountAsync();
        }

        /// <summary>
        /// Get all entities
        /// </summary>
        /// <param name="option"></param>
        /// <returns></returns>
        public async Task<ICollection<TEntity>> GetAllAsync(bool option = false)
        {
            var ListData = new List<TEntity>();
            (await this.Entities.ToListAsync()).ForEach(item =>
            {
                if (!option && item != null)
                    this.Context.Entry(item).State = EntityState.Detached;

                ListData.Add(item);
            });
            return ListData;
        }
        #endregion

        #region Add
        /// <summary>
        /// Inserts a single object to the database and commits the change
        /// </summary>
        /// <remarks>Synchronous</remarks>
        /// <param name="nTEntity">The object to insert</param>
        /// <returns>The resulting object including its primary key after the insert</returns>
        public TEntity Add(TEntity nTEntity)
        {
            this.Entities.Add(nTEntity);
            this.Context.SaveChanges();
            this.Context.Entry(nTEntity).State = EntityState.Deleted;
            return nTEntity;
        }

        /// <summary>
        /// Inserts a single object to the database and commits the change
        /// </summary>
        /// <remarks>Asynchronous</remarks>
        /// <param name="nTEntity">The object to insert</param>
        /// <returns>The resulting object including its primary key after the insert</returns>
        public async Task<TEntity> AddAsync(TEntity nTEntity)
        {
            this.Entities.Add(nTEntity);
            await this.Context.SaveChangesAsync();
            this.Context.Entry(nTEntity).State = EntityState.Detached;
            return nTEntity;
        }
        /// <summary>
        /// Inserts a collection of objects into the database and commits the changes
        /// </summary>
        /// <remarks>Asynchronous</remarks>
        /// <param name="nTEntityList">An IEnumerable list of objects to insert</param>
        /// <returns>The IEnumerable resulting list of inserted objects including the primary keys</returns>
        public async Task<IEnumerable<TEntity>> AddAllAsync(IEnumerable<TEntity> nTEntityList)
        {
            this.Entities.AddRange(nTEntityList);
            await this.Context.SaveChangesAsync();

            foreach (var item in nTEntityList)
                this.Context.Entry(item).State = EntityState.Detached;

            return nTEntityList;
        }
        #endregion

        #region Update

        /// <summary>
        /// Updates a single object based on the provided primary key and commits the change
        /// </summary>
        /// <remarks>Synchronous</remarks>
        /// <param name="updated">The updated object to apply to the database</param>
        /// <param name="key">The primary key of the object to update</param>
        /// <returns>The resulting updated object</returns>
        public TEntity Update(TEntity updated, int key)
        {
            if (updated == null)
                return null;

            TEntity existing = this.Entities.Find(key);
            if (existing != null)
            {
                this.Context.Entry(existing).CurrentValues.SetValues(updated);
                this.Context.SaveChanges();
            }
            return existing;
        }
        public TEntity Update(TEntity updated, string key)
        {
            if (updated == null)
                return null;

            TEntity existing = this.Entities.Find(key);
            if (existing != null)
            {
                this.Context.Entry(existing).CurrentValues.SetValues(updated);
                this.Context.SaveChanges();
            }
            return existing;
        }

        /// <summary>
        /// Updates a single object based on the provided primary key and commits the change
        /// </summary>
        /// <remarks>Asynchronous</remarks>
        /// <param name="updated">The updated object to apply to the database</param>
        /// <param name="key">The primary key of the object to update</param>
        /// <returns>The resulting updated object</returns>
        public async Task<TEntity> UpdateAsync(TEntity updated, int key)
        {
            if (updated == null)
                return null;

            TEntity existing = await this.Entities.FindAsync(key);
            if (existing != null)
            {
                this.Context.Entry(existing).CurrentValues.SetValues(updated);
                await this.Context.SaveChangesAsync();
                this.Context.Entry(existing).State = EntityState.Detached;
            }
            return existing;
        }
        /// <summary>
        /// Updates a single object based on the provided primary key and commits the change
        /// </summary>
        /// <remarks>Asynchronous</remarks>
        /// <param name="updated">The updated object to apply to the database</param>
        /// <param name="key">The primary key of the object to update</param>
        /// <returns>The resulting updated object</returns>
        public async Task<TEntity> UpdateAsync(TEntity updated, string key)
        {
            if (updated == null)
                return null;

            TEntity existing = await this.Entities.FindAsync(key);
            if (existing != null)
            {
                this.Context.Entry(existing).CurrentValues.SetValues(updated);
                await this.Context.SaveChangesAsync();
                this.Context.Entry(existing).State = EntityState.Detached;
            }
            return existing;
        }
        #endregion

        #region Delete
        /// <summary>
        /// Deletes a single object from the database and commits the change
        /// </summary>
        /// <remarks>Synchronous</remarks>
        /// <param name="key">The object to delete</param>
        public void Delete(int key)
        {
            TEntity existing = this.Entities.Find(key);
            if (existing != null)
            {
                this.Entities.Remove(existing);
                this.Context.SaveChanges();
            }
        }
        /// <summary>
        /// Deletes a single object from the database and commits the change
        /// </summary>
        /// <remarks>Synchronous</remarks>
        /// <param name="key">The object to delete</param>
        public void Delete(string key)
        {
            TEntity existing = this.Entities.Find(key);
            if (existing != null)
            {
                this.Entities.Remove(existing);
                this.Context.SaveChanges();
            }
        }
        /// <summary>
        /// Deletes a single object from the database and commits the change
        /// </summary>
        /// <remarks>Asynchronous</remarks>
        /// <param name="key">The primary key of the object to delete</param>
        public async Task<int> DeleteAsync(int key)
        {
            TEntity existing = await this.Entities.FindAsync(key);
            if (existing != null)
            {
                this.Entities.Remove(existing);
                return await this.Context.SaveChangesAsync();
            }
            return 0;
        }
        /// <summary>
        /// Deletes a single object from the database and commits the change
        /// </summary>
        /// <remarks>Asynchronous</remarks>
        /// <param name="key">The primary key of the object to delete</param>
        public async Task<int> DeleteAsync(string key)
        {
            TEntity existing = await this.Entities.FindAsync(key);
            if (existing != null)
            {
                this.Entities.Remove(existing);
                return await this.Context.SaveChangesAsync();
            }
            return 0;
        }
        #endregion

        #region Any
        public async Task<bool> AnyDataAsync(Expression<Func<TEntity, bool>> match)
        {
            return await this.Entities.Where(match).AnyAsync();
        }
        #endregion
    }
}
