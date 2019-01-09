using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class AddMoreModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "UnitPrice",
                table: "SparePart",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WorkGroupMaintenanceId",
                table: "ItemMaintenance",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ItemMainHasEmployee",
                columns: table => new
                {
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    ItemMainHasEmployeeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Remark = table.Column<string>(maxLength: 200, nullable: true),
                    ItemMaintenanceId = table.Column<int>(nullable: true),
                    EmpCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemMainHasEmployee", x => x.ItemMainHasEmployeeId);
                    table.ForeignKey(
                        name: "FK_ItemMainHasEmployee_ItemMaintenance_ItemMaintenanceId",
                        column: x => x.ItemMaintenanceId,
                        principalTable: "ItemMaintenance",
                        principalColumn: "ItemMaintenanceId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WorkGroupMaintenance",
                columns: table => new
                {
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    WorkGroupMaintenanceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    Description = table.Column<string>(maxLength: 200, nullable: true),
                    Remark = table.Column<string>(maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkGroupMaintenance", x => x.WorkGroupMaintenanceId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemMaintenance_WorkGroupMaintenanceId",
                table: "ItemMaintenance",
                column: "WorkGroupMaintenanceId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemMainHasEmployee_ItemMaintenanceId",
                table: "ItemMainHasEmployee",
                column: "ItemMaintenanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemMaintenance_WorkGroupMaintenance_WorkGroupMaintenanceId",
                table: "ItemMaintenance",
                column: "WorkGroupMaintenanceId",
                principalTable: "WorkGroupMaintenance",
                principalColumn: "WorkGroupMaintenanceId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemMaintenance_WorkGroupMaintenance_WorkGroupMaintenanceId",
                table: "ItemMaintenance");

            migrationBuilder.DropTable(
                name: "ItemMainHasEmployee");

            migrationBuilder.DropTable(
                name: "WorkGroupMaintenance");

            migrationBuilder.DropIndex(
                name: "IX_ItemMaintenance_WorkGroupMaintenanceId",
                table: "ItemMaintenance");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "SparePart");

            migrationBuilder.DropColumn(
                name: "WorkGroupMaintenanceId",
                table: "ItemMaintenance");
        }
    }
}
