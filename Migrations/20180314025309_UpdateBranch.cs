using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class UpdateBranch : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ItemTypeId",
                table: "TypeMaintenance",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCodeMasterId",
                table: "RequireMaintenance",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Branch",
                maxLength: 250,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TypeMaintenance_ItemTypeId",
                table: "TypeMaintenance",
                column: "ItemTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_TypeMaintenance_ItemType_ItemTypeId",
                table: "TypeMaintenance",
                column: "ItemTypeId",
                principalTable: "ItemType",
                principalColumn: "ItemTypeId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TypeMaintenance_ItemType_ItemTypeId",
                table: "TypeMaintenance");

            migrationBuilder.DropIndex(
                name: "IX_TypeMaintenance_ItemTypeId",
                table: "TypeMaintenance");

            migrationBuilder.DropColumn(
                name: "ItemTypeId",
                table: "TypeMaintenance");

            migrationBuilder.DropColumn(
                name: "ProjectCodeMasterId",
                table: "RequireMaintenance");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Branch");
        }
    }
}
