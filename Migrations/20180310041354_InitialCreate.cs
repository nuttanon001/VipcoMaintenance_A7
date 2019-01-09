using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Branch",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    BranchId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branch", x => x.BranchId);
                });

            migrationBuilder.CreateTable(
                name: "MovementStockSp",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    MovementStockSpId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    MovementDate = table.Column<DateTime>(nullable: false),
                    Quantity = table.Column<double>(nullable: false),
                    MovementStatus = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovementStockSp", x => x.MovementStockSpId);
                });

            migrationBuilder.CreateTable(
                name: "Permission",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    PermissionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(nullable: false),
                    LevelPermission = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permission", x => x.PermissionId);
                });

            migrationBuilder.CreateTable(
                name: "TypeMaintenance",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    TypeMaintenanceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    Description = table.Column<string>(maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeMaintenance", x => x.TypeMaintenanceId);
                });

            migrationBuilder.CreateTable(
                name: "WorkGroup",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    WorkGroupId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 150, nullable: true),
                    Description = table.Column<string>(maxLength: 200, nullable: true),
                    Remark = table.Column<string>(maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkGroup", x => x.WorkGroupId);
                });

            migrationBuilder.CreateTable(
                name: "ItemType",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ItemTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 150, nullable: true),
                    Description = table.Column<string>(maxLength: 200, nullable: true),
                    Remark = table.Column<string>(maxLength: 200, nullable: true),
                    WorkGroupId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemType", x => x.ItemTypeId);
                    table.ForeignKey(
                        name: "FK_ItemType_WorkGroup_WorkGroupId",
                        column: x => x.WorkGroupId,
                        principalTable: "WorkGroup",
                        principalColumn: "WorkGroupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SparePart",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    SparePartId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 200, nullable: true),
                    Description = table.Column<string>(maxLength: 250, nullable: true),
                    Remark = table.Column<string>(maxLength: 200, nullable: true),
                    Model = table.Column<string>(maxLength: 200, nullable: true),
                    Size = table.Column<string>(maxLength: 200, nullable: true),
                    Property = table.Column<string>(maxLength: 200, nullable: true),
                    SparePartImage = table.Column<string>(nullable: true),
                    MinStock = table.Column<double>(nullable: true),
                    MaxStock = table.Column<double>(nullable: true),
                    WorkGroupId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SparePart", x => x.SparePartId);
                    table.ForeignKey(
                        name: "FK_SparePart_WorkGroup_WorkGroupId",
                        column: x => x.WorkGroupId,
                        principalTable: "WorkGroup",
                        principalColumn: "WorkGroupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Item",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ItemId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ItemCode = table.Column<string>(maxLength: 50, nullable: true),
                    Name = table.Column<string>(maxLength: 250, nullable: true),
                    Description = table.Column<string>(maxLength: 250, nullable: true),
                    Model = table.Column<string>(maxLength: 200, nullable: true),
                    Brand = table.Column<string>(maxLength: 200, nullable: true),
                    Property = table.Column<string>(maxLength: 200, nullable: true),
                    Property2 = table.Column<string>(maxLength: 200, nullable: true),
                    Property3 = table.Column<string>(maxLength: 200, nullable: true),
                    ItemStatus = table.Column<int>(nullable: true),
                    ItemImage = table.Column<string>(nullable: true),
                    ItemTypeId = table.Column<int>(nullable: true),
                    EmpResponsible = table.Column<string>(nullable: true),
                    BranchId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Item", x => x.ItemId);
                    table.ForeignKey(
                        name: "FK_Item_Branch_BranchId",
                        column: x => x.BranchId,
                        principalTable: "Branch",
                        principalColumn: "BranchId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Item_ItemType_ItemTypeId",
                        column: x => x.ItemTypeId,
                        principalTable: "ItemType",
                        principalColumn: "ItemTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReceiveStockSp",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ReceiveStockSpId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PurchaseOrder = table.Column<string>(nullable: true),
                    Remark = table.Column<string>(maxLength: 200, nullable: true),
                    ReceiveEmp = table.Column<string>(nullable: true),
                    SparePartId = table.Column<int>(nullable: true),
                    MovementStockSpId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReceiveStockSp", x => x.ReceiveStockSpId);
                    table.ForeignKey(
                        name: "FK_ReceiveStockSp_MovementStockSp_MovementStockSpId",
                        column: x => x.MovementStockSpId,
                        principalTable: "MovementStockSp",
                        principalColumn: "MovementStockSpId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReceiveStockSp_SparePart_SparePartId",
                        column: x => x.SparePartId,
                        principalTable: "SparePart",
                        principalColumn: "SparePartId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RequireMaintenance",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    RequireMaintenanceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RequireNo = table.Column<string>(nullable: true),
                    RequireDate = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(maxLength: 500, nullable: true),
                    Remark = table.Column<string>(maxLength: 200, nullable: true),
                    RequireStatus = table.Column<int>(nullable: true),
                    GroupMIS = table.Column<string>(nullable: true),
                    RequireEmp = table.Column<string>(nullable: true),
                    ItemId = table.Column<int>(nullable: true),
                    BranchId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequireMaintenance", x => x.RequireMaintenanceId);
                    table.ForeignKey(
                        name: "FK_RequireMaintenance_Branch_BranchId",
                        column: x => x.BranchId,
                        principalTable: "Branch",
                        principalColumn: "BranchId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RequireMaintenance_Item_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Item",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ItemMaintenance",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    ItemMaintenanceId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ItemMaintenanceCode = table.Column<string>(nullable: false),
                    PlanStartDate = table.Column<DateTime>(nullable: false),
                    PlanEndDate = table.Column<DateTime>(nullable: false),
                    ActualStartDate = table.Column<DateTime>(nullable: true),
                    ActualEndDate = table.Column<DateTime>(nullable: true),
                    StatusMaintenance = table.Column<int>(nullable: true),
                    Description = table.Column<string>(maxLength: 500, nullable: true),
                    Remark = table.Column<string>(maxLength: 200, nullable: true),
                    MaintenanceEmp = table.Column<string>(nullable: true),
                    RequireMaintenanceId = table.Column<int>(nullable: true),
                    TypeMaintenanceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemMaintenance", x => x.ItemMaintenanceId);
                    table.ForeignKey(
                        name: "FK_ItemMaintenance_RequireMaintenance_RequireMaintenanceId",
                        column: x => x.RequireMaintenanceId,
                        principalTable: "RequireMaintenance",
                        principalColumn: "RequireMaintenanceId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemMaintenance_TypeMaintenance_TypeMaintenanceId",
                        column: x => x.TypeMaintenanceId,
                        principalTable: "TypeMaintenance",
                        principalColumn: "TypeMaintenanceId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RequisitionStockSp",
                columns: table => new
                {
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Creator = table.Column<string>(maxLength: 50, nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(maxLength: 50, nullable: true),
                    RequisitionStockSpId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Remark = table.Column<string>(nullable: true),
                    RequisitionEmp = table.Column<string>(nullable: true),
                    SparePartId = table.Column<int>(nullable: true),
                    ItemMaintenanceId = table.Column<int>(nullable: true),
                    MovementStockSpId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequisitionStockSp", x => x.RequisitionStockSpId);
                    table.ForeignKey(
                        name: "FK_RequisitionStockSp_ItemMaintenance_ItemMaintenanceId",
                        column: x => x.ItemMaintenanceId,
                        principalTable: "ItemMaintenance",
                        principalColumn: "ItemMaintenanceId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RequisitionStockSp_MovementStockSp_MovementStockSpId",
                        column: x => x.MovementStockSpId,
                        principalTable: "MovementStockSp",
                        principalColumn: "MovementStockSpId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RequisitionStockSp_SparePart_SparePartId",
                        column: x => x.SparePartId,
                        principalTable: "SparePart",
                        principalColumn: "SparePartId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Item_BranchId",
                table: "Item",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemTypeId",
                table: "Item",
                column: "ItemTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemMaintenance_RequireMaintenanceId",
                table: "ItemMaintenance",
                column: "RequireMaintenanceId",
                unique: true,
                filter: "[RequireMaintenanceId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ItemMaintenance_TypeMaintenanceId",
                table: "ItemMaintenance",
                column: "TypeMaintenanceId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemType_WorkGroupId",
                table: "ItemType",
                column: "WorkGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ReceiveStockSp_MovementStockSpId",
                table: "ReceiveStockSp",
                column: "MovementStockSpId",
                unique: true,
                filter: "[MovementStockSpId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ReceiveStockSp_SparePartId",
                table: "ReceiveStockSp",
                column: "SparePartId");

            migrationBuilder.CreateIndex(
                name: "IX_RequireMaintenance_BranchId",
                table: "RequireMaintenance",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_RequireMaintenance_ItemId",
                table: "RequireMaintenance",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_RequisitionStockSp_ItemMaintenanceId",
                table: "RequisitionStockSp",
                column: "ItemMaintenanceId");

            migrationBuilder.CreateIndex(
                name: "IX_RequisitionStockSp_MovementStockSpId",
                table: "RequisitionStockSp",
                column: "MovementStockSpId",
                unique: true,
                filter: "[MovementStockSpId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_RequisitionStockSp_SparePartId",
                table: "RequisitionStockSp",
                column: "SparePartId");

            migrationBuilder.CreateIndex(
                name: "IX_SparePart_WorkGroupId",
                table: "SparePart",
                column: "WorkGroupId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Permission");

            migrationBuilder.DropTable(
                name: "ReceiveStockSp");

            migrationBuilder.DropTable(
                name: "RequisitionStockSp");

            migrationBuilder.DropTable(
                name: "ItemMaintenance");

            migrationBuilder.DropTable(
                name: "MovementStockSp");

            migrationBuilder.DropTable(
                name: "SparePart");

            migrationBuilder.DropTable(
                name: "RequireMaintenance");

            migrationBuilder.DropTable(
                name: "TypeMaintenance");

            migrationBuilder.DropTable(
                name: "Item");

            migrationBuilder.DropTable(
                name: "Branch");

            migrationBuilder.DropTable(
                name: "ItemType");

            migrationBuilder.DropTable(
                name: "WorkGroup");
        }
    }
}
