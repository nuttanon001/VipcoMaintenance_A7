using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class addObsoleteItem3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ObsoleteItemlId",
                table: "ObsoleteItemHasAttach");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ObsoleteItemlId",
                table: "ObsoleteItemHasAttach",
                nullable: true);
        }
    }
}
