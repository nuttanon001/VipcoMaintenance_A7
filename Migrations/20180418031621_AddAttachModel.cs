using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class AddAttachModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RequireMaintenanceHasAttach",
                columns: table => new
                {
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    RequireMaintenanceHasAttachId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RequireMaintenanceId = table.Column<int>(nullable: true),
                    AttachFileId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequireMaintenanceHasAttach", x => x.RequireMaintenanceHasAttachId);
                    table.ForeignKey(
                        name: "FK_RequireMaintenanceHasAttach_RequireMaintenance_RequireMaintenanceId",
                        column: x => x.RequireMaintenanceId,
                        principalTable: "RequireMaintenance",
                        principalColumn: "RequireMaintenanceId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RequireMaintenanceHasAttach_RequireMaintenanceId",
                table: "RequireMaintenanceHasAttach",
                column: "RequireMaintenanceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RequireMaintenanceHasAttach");
        }
    }
}
