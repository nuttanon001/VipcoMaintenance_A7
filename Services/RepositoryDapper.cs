using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.ViewModels;

namespace VipcoMaintenance.Services
{
    public class RepositoryDapper<Entity> : IRepositoryDapper<Entity> where Entity : class
    {
        private readonly IConfiguration config;
        public RepositoryDapper(IConfiguration config)
        {
            this.config = config;
        }
        public IDbConnection Connection
        {
            get
            {
                return new SqlConnection(this.config.GetConnectionString("MaintenanceConnection"));
            }
        }

        public async Task<Entity> GetFirstEntity(SqlCommandViewModel sqlCommand, int timeout = 60)
        {
            string sSqlCommand = $@"SELECT {sqlCommand.SelectCommand}
                                    FROM {sqlCommand.FromCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.WhereCommand))
                sSqlCommand += $@"WHERE {sqlCommand.WhereCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.GroupCommand))
                sSqlCommand += $@"GROUP BY {sqlCommand.GroupCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.OrderCommand))
                sSqlCommand += $@"ORDER BY {sqlCommand.OrderCommand} ";

            using (IDbConnection conn = Connection)
            {
                conn.Open();
                var result = await conn.QueryFirstOrDefaultAsync<Entity>(sSqlCommand, commandTimeout: timeout);
                conn.Close();
                return result;
            }
        }
        public async Task<Entity2> GetFirstEntity<Entity2>(SqlCommandViewModel sqlCommand, int timeout = 60)
        {
            string sSqlCommand = $@"SELECT {sqlCommand.SelectCommand}
                                    FROM {sqlCommand.FromCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.WhereCommand))
                sSqlCommand += $@"WHERE {sqlCommand.WhereCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.GroupCommand))
                sSqlCommand += $@"GROUP BY {sqlCommand.GroupCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.OrderCommand))
                sSqlCommand += $@"ORDER BY {sqlCommand.OrderCommand} ";

            using (IDbConnection conn = Connection)
            {
                conn.Open();
                var result = await conn.QueryFirstOrDefaultAsync<Entity2>(sSqlCommand, commandTimeout: timeout);
                conn.Close();
                return result;
            }
        }
        public async Task<ReturnViewModel<Entity>> GetEntitiesAndTotal<Parameter>(SqlCommandViewModel sqlCommand ,Parameter parameter,int timeout = 60)
        {
            string sSqlCommand = $@"SELECT {sqlCommand.SelectCommand}
                                    FROM {sqlCommand.FromCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.WhereCommand))
                sSqlCommand += $@"WHERE {sqlCommand.WhereCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.GroupCommand))
                sSqlCommand += $@"GROUP BY {sqlCommand.GroupCommand} ";

            // Query Total Record
            var sSubSqlCommand = $@"SELECT COUNT(*)
                                    FROM ({sSqlCommand}) As Total";

            if (!string.IsNullOrEmpty(sqlCommand.OrderCommand))
                sSqlCommand += $@"ORDER BY {sqlCommand.OrderCommand} ";

            sSqlCommand += $@"OFFSET @Skip ROWS
                              FETCH NEXT @Take ROWS ONLY;";

            sSqlCommand += sSubSqlCommand;

            using (IDbConnection conn = Connection)
            {
                conn.Open();
                var result = await conn.QueryMultipleAsync(sSqlCommand, parameter, commandTimeout: timeout);
                var dbData = new ReturnViewModel<Entity>()
                {
                    Entities = result.Read<Entity>().ToList(),
                    TotalRow = result.Read<int>().FirstOrDefault()
                };
                conn.Close();
                return dbData;
            }
        }
        public async Task<ReturnViewModel<Entities>> GetEntitiesAndTotal<Parameter, Entities>(SqlCommandViewModel sqlCommand, Parameter parameter, int timeout = 60)
        {
            string sSqlCommand = $@"SELECT {sqlCommand.SelectCommand}
                                    FROM {sqlCommand.FromCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.WhereCommand))
                sSqlCommand += $@"WHERE {sqlCommand.WhereCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.GroupCommand))
                sSqlCommand += $@"GROUP BY {sqlCommand.GroupCommand} ";

            // Query Total Record
            var sSubSqlCommand = $@"SELECT COUNT(*)
                                    FROM ({sSqlCommand}) As Total";

            if (!string.IsNullOrEmpty(sqlCommand.OrderCommand))
                sSqlCommand += $@"ORDER BY {sqlCommand.OrderCommand} ";

            sSqlCommand += $@"OFFSET @Skip ROWS
                              FETCH NEXT @Take ROWS ONLY;";
            // Mulit query
            sSqlCommand += sSubSqlCommand;

            using (IDbConnection conn = Connection)
            {
                conn.Open();
                var result = await conn.QueryMultipleAsync(sSqlCommand, parameter, commandTimeout: timeout);
                var dbData = new ReturnViewModel<Entities>()
                {
                    Entities = result.Read<Entities>().ToList(),
                    TotalRow = result.Read<int>().FirstOrDefault()
                };
                conn.Close();
                return dbData;
            }
        }
        public async Task<List<Entity>> GetListEntites<Parameter>(string SqlCommand, Parameter parameter, int timeout = 60)
        {
            using (IDbConnection conn = Connection)
            {
                conn.Open();
                var result = await conn.QueryAsync<Entity>(SqlCommand, parameter, commandTimeout: timeout);
                conn.Close();
                return result.ToList();
            }
        }
        public async Task<List<Entity>> GetListEntites(SqlCommandViewModel sqlCommand, int timeout = 60)
        {
            string sSqlCommand = $@"SELECT {sqlCommand.SelectCommand}
                                    FROM {sqlCommand.FromCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.WhereCommand))
                sSqlCommand += $@"WHERE {sqlCommand.WhereCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.GroupCommand))
                sSqlCommand += $@"GROUP BY {sqlCommand.GroupCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.OrderCommand))
                sSqlCommand += $@"ORDER BY {sqlCommand.OrderCommand} ";

            using (IDbConnection conn = Connection)
            {
                conn.Open();
                var result = await conn.QueryAsync<Entity>(sSqlCommand, commandTimeout: timeout);
                conn.Close();
                return result.ToList();
            }
        }
        public async Task<List<Entity>> GetListEntites(string SqlCommand, int timeout = 60)
        {
            using (IDbConnection conn = Connection)
            {
                conn.Open();
                var result = await conn.QueryAsync<Entity>(SqlCommand, commandTimeout: timeout);
                conn.Close();
                return result.ToList();
            }
        }
        public async Task<List<Entities>> GetListEntites<Entities>(SqlCommandViewModel sqlCommand, int timeout = 60)
        {
            string sSqlCommand = $@"SELECT {sqlCommand.SelectCommand}
                                    FROM {sqlCommand.FromCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.WhereCommand))
                sSqlCommand += $@"WHERE {sqlCommand.WhereCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.GroupCommand))
                sSqlCommand += $@"GROUP BY {sqlCommand.GroupCommand} ";

            if (!string.IsNullOrEmpty(sqlCommand.OrderCommand))
                sSqlCommand += $@"ORDER BY {sqlCommand.OrderCommand} ";

            using (IDbConnection conn = Connection)
            {
                conn.Open();
                var result = await conn.QueryAsync<Entities>(sSqlCommand, commandTimeout: timeout);
                conn.Close();
                return result.ToList();
            }
        }
        public async Task<ReturnViewModel<Entity>> GetListEntitesAndTotalRow<Parameter>(string SqlCommand, Parameter parameter, int timeout = 60)
        {
            using (IDbConnection conn = Connection)
            {
                conn.Open();
                var result = await conn.QueryMultipleAsync(SqlCommand, parameter, commandTimeout: timeout);
                var dbData = new ReturnViewModel<Entity>()
                {
                    Entities = result.Read<Entity>().ToList(),
                    TotalRow = result.Read<int>().FirstOrDefault()
                };
                conn.Close();

                return dbData;
            }
        }
        public async Task<bool> ExecuteReturnNoResult(SqlCommandViewModel SqlCommand, int timeout = 60)
        {
            var sSqlCommands = "";

            // Sql insert command
            if (!string.IsNullOrEmpty(SqlCommand.InsertCommand))
            {
                sSqlCommands += $@"INSERT INTO {SqlCommand.InsertCommand} ";

                if (!string.IsNullOrEmpty(SqlCommand.SelectCommand))
                    sSqlCommands += $@"SELECT {SqlCommand.SelectCommand} ";
                if (!string.IsNullOrEmpty(SqlCommand.FromCommand))
                    sSqlCommands += $@"FROM {SqlCommand.FromCommand} ";
                if (!string.IsNullOrEmpty(SqlCommand.WhereCommand))
                    sSqlCommands += $@"WHERE {SqlCommand.WhereCommand} ";
                if (!string.IsNullOrEmpty(SqlCommand.ValueCommand))
                    sSqlCommands += $@"VALUES {SqlCommand.ValueCommand}";
            }
            // Sql update command
            else if (!string.IsNullOrEmpty(SqlCommand.UpdateCommand))
            {
                sSqlCommands += $@"UPDATE {SqlCommand.UpdateCommand} ";

                if (!string.IsNullOrEmpty(SqlCommand.SelectCommand))
                    sSqlCommands += $@"SET {SqlCommand.SelectCommand} ";
                if (!string.IsNullOrEmpty(SqlCommand.FromCommand))
                    sSqlCommands += $@"FROM {SqlCommand.FromCommand} ";
                if (!string.IsNullOrEmpty(SqlCommand.WhereCommand))
                    sSqlCommands += $@"WHERE {SqlCommand.WhereCommand} ";
            }
            // Sql select command
            else
            {

            }

            using (IDbConnection conn = Connection)
            {
                var result = await conn.ExecuteAsync(sql: sSqlCommands, commandTimeout: timeout);
                return result > 0;
            }
        }
        public async Task<bool> ExecuteReturnNoResult(string SqlCommand,int timeout = 60)
        {
            using(IDbConnection conn = Connection)
            {
                var result = await conn.ExecuteAsync(sql : SqlCommand, commandTimeout : timeout);
                return result > 0;
            }
        }
        public async Task<bool> ExecuteReturnNoResult<Parameter>(string SqlCommand, Parameter parameter, int timeout = 60)
        {
            using (IDbConnection conn = Connection)
            {
                var result = await conn.ExecuteAsync(sql: SqlCommand,param: parameter, commandTimeout: timeout);
                return result > 0;
            }
        }
    }
}