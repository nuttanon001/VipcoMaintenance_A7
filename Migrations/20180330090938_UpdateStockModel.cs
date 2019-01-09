using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class UpdateStockModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PaperNo",
                table: "RequisitionStockSp",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Quantity",
                table: "RequisitionStockSp",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<DateTime>(
                name: "RequisitionDate",
                table: "RequisitionStockSp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<double>(
                name: "Quantity",
                table: "ReceiveStockSp",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReceiveDate",
                table: "ReceiveStockSp",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaperNo",
                table: "RequisitionStockSp");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "RequisitionStockSp");

            migrationBuilder.DropColumn(
                name: "RequisitionDate",
                table: "RequisitionStockSp");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "ReceiveStockSp");

            migrationBuilder.DropColumn(
                name: "ReceiveDate",
                table: "ReceiveStockSp");
        }
    }
}
