using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class addObsoleteItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "ObsoleteItem",
                columns: table => new
                {
                    ObsoleteItemId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    ObsoleteNo = table.Column<string>(maxLength: 50, nullable: true),
                    ObsoleteDate = table.Column<DateTimeOffset>(nullable: true),
                    FixedAsset = table.Column<double>(nullable: true),
                    Approve1 = table.Column<string>(maxLength: 50, nullable: true),
                    Approve1NameThai = table.Column<string>(maxLength: 200, nullable: true),
                    Approve1Date = table.Column<DateTimeOffset>(nullable: true),
                    ItemId = table.Column<int>(nullable: true),
                    Description = table.Column<string>(maxLength: 500, nullable: true),
                    Request = table.Column<string>(maxLength: 50, nullable: true),
                    RequestNameThai = table.Column<string>(maxLength: 200, nullable: true),
                    Approve2 = table.Column<string>(maxLength: 50, nullable: true),
                    Approve2NameThai = table.Column<string>(maxLength: 200, nullable: true),
                    Approve2Date = table.Column<DateTimeOffset>(nullable: true),
                    Remark = table.Column<string>(maxLength: 500, nullable: true),
                    ApproveToFix = table.Column<bool>(nullable: true),
                    ApproveToObsolete = table.Column<bool>(nullable: true),
                    ComplateBy = table.Column<string>(maxLength: 50, nullable: true),
                    ComplateByNameThai = table.Column<string>(maxLength: 200, nullable: true),
                    Status = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ObsoleteItem", x => x.ObsoleteItemId);
                    table.ForeignKey(
                        name: "FK_ObsoleteItem_Item_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Item",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ObsoleteItemHasAttach",
                columns: table => new
                {
                    ObsoleteItemHasAttachId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    ObsoleteItemlId = table.Column<int>(nullable: true),
                    ObsoleteItemId = table.Column<int>(nullable: true),
                    AttachFileId = table.Column<int>(nullable: true),
                    FileType = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ObsoleteItemHasAttach", x => x.ObsoleteItemHasAttachId);
                    table.ForeignKey(
                        name: "FK_ObsoleteItemHasAttach_AttachFile_AttachFileId",
                        column: x => x.AttachFileId,
                        principalTable: "AttachFile",
                        principalColumn: "AttachFileId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ObsoleteItemHasAttach_ObsoleteItem_ObsoleteItemId",
                        column: x => x.ObsoleteItemId,
                        principalTable: "ObsoleteItem",
                        principalColumn: "ObsoleteItemId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ObsoleteItem_ItemId",
                table: "ObsoleteItem",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ObsoleteItemHasAttach_AttachFileId",
                table: "ObsoleteItemHasAttach",
                column: "AttachFileId");

            migrationBuilder.CreateIndex(
                name: "IX_ObsoleteItemHasAttach_ObsoleteItemId",
                table: "ObsoleteItemHasAttach",
                column: "ObsoleteItemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ObsoleteItemHasAttach");

            migrationBuilder.DropTable(
                name: "AttachFile");

            migrationBuilder.DropTable(
                name: "ObsoleteItem");
        }
    }
}
