using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMaintenance.Migrations
{
    public partial class updatePermission : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubLevel",
                table: "Permission",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubLevel",
                table: "Permission");
        }
    }
}
