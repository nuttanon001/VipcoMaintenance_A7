using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class AddAdjustModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdjustStockSp",
                columns: table => new
                {
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    AdjustStockSpId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(maxLength: 200, nullable: true),
                    AdjustDate = table.Column<DateTime>(nullable: false),
                    Quantity = table.Column<double>(nullable: false),
                    EmpCode = table.Column<string>(nullable: true),
                    SparePartId = table.Column<int>(nullable: true),
                    MovementStockSpId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdjustStockSp", x => x.AdjustStockSpId);
                    table.ForeignKey(
                        name: "FK_AdjustStockSp_MovementStockSp_MovementStockSpId",
                        column: x => x.MovementStockSpId,
                        principalTable: "MovementStockSp",
                        principalColumn: "MovementStockSpId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AdjustStockSp_SparePart_SparePartId",
                        column: x => x.SparePartId,
                        principalTable: "SparePart",
                        principalColumn: "SparePartId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdjustStockSp_MovementStockSpId",
                table: "AdjustStockSp",
                column: "MovementStockSpId",
                unique: true,
                filter: "[MovementStockSpId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AdjustStockSp_SparePartId",
                table: "AdjustStockSp",
                column: "SparePartId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdjustStockSp");
        }
    }
}
