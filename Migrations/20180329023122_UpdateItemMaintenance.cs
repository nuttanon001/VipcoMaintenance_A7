using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class UpdateItemMaintenance : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ItemMaintenanceCode",
                table: "ItemMaintenance",
                newName: "ItemMaintenanceNo");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ItemMaintenanceNo",
                table: "ItemMaintenance",
                newName: "ItemMaintenanceCode");
        }
    }
}
