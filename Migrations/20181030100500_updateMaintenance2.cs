using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class updateMaintenance2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequireDateTime",
                table: "RequireMaintenance",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActualEndDateTime",
                table: "ItemMaintenance",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActualStartDateTime",
                table: "ItemMaintenance",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CancelDate",
                table: "Item",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RegisterDate",
                table: "Item",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequireDateTime",
                table: "RequireMaintenance");

            migrationBuilder.DropColumn(
                name: "ActualEndDateTime",
                table: "ItemMaintenance");

            migrationBuilder.DropColumn(
                name: "ActualStartDateTime",
                table: "ItemMaintenance");

            migrationBuilder.DropColumn(
                name: "CancelDate",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "RegisterDate",
                table: "Item");
        }
    }
}
