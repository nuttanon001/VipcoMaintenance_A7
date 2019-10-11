using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class addObsoleteItem2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ObsoleteItemHasAttach_AttachFile_AttachFileId",
                table: "ObsoleteItemHasAttach");

            migrationBuilder.DropTable(
                name: "AttachFile");

            migrationBuilder.DropIndex(
                name: "IX_ObsoleteItemHasAttach_AttachFileId",
                table: "ObsoleteItemHasAttach");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AttachFile",
                columns: table => new
                {
                    AttachFileId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(nullable: true),
                    FileAddress = table.Column<string>(nullable: true),
                    FileName = table.Column<string>(nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttachFile", x => x.AttachFileId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ObsoleteItemHasAttach_AttachFileId",
                table: "ObsoleteItemHasAttach",
                column: "AttachFileId");

            migrationBuilder.AddForeignKey(
                name: "FK_ObsoleteItemHasAttach_AttachFile_AttachFileId",
                table: "ObsoleteItemHasAttach",
                column: "AttachFileId",
                principalTable: "AttachFile",
                principalColumn: "AttachFileId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
