using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class UpdateSparePart : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SparePartId",
                table: "MovementStockSp",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MovementStockSp_SparePartId",
                table: "MovementStockSp",
                column: "SparePartId");

            migrationBuilder.AddForeignKey(
                name: "FK_MovementStockSp_SparePart_SparePartId",
                table: "MovementStockSp",
                column: "SparePartId",
                principalTable: "SparePart",
                principalColumn: "SparePartId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovementStockSp_SparePart_SparePartId",
                table: "MovementStockSp");

            migrationBuilder.DropIndex(
                name: "IX_MovementStockSp_SparePartId",
                table: "MovementStockSp");

            migrationBuilder.DropColumn(
                name: "SparePartId",
                table: "MovementStockSp");
        }
    }
}
