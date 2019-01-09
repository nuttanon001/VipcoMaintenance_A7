using AutoMapper;
using VipcoMaintenance.Models.Machines;
using VipcoMaintenance.Models.Maintenances;
using VipcoMaintenance.ViewModels;


namespace VipcoMaintenance.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            ///////////////////
            /// Maintenance ///
            ///////////////////

            #region Branch

            CreateMap<Branch, BranchViewModel>()
                .ForMember(x => x.RequireMaintenances, o => o.Ignore())
                .ForMember(x => x.Items, o => o.Ignore());

            #endregion

            #region ItemMaintenance
            // ItemMaintenance
            CreateMap<ItemMaintenance, ItemMaintenanceViewModel>()
                .ForMember(x => x.StatusMaintenanceString,
                             o => o.MapFrom(s => System.Enum.GetName(typeof(StatusMaintenance), s.StatusMaintenance)))
                .ForMember(x => x.TypeMaintenanceString,
                            o => o.MapFrom(s => s.TypeMaintenance == null ? "ไม่ระบุ" : s.TypeMaintenance.Name))
                .ForMember(x => x.TypeMaintenance, o => o.Ignore())
                .ForMember(x => x.WorkGroupMaintenanceString,
                            o => o.MapFrom(s => s.WorkGroupMaintenance == null ? "ไม่ระบุ" : s.WorkGroupMaintenance.Name))
                .ForMember(x => x.WorkGroupMaintenance,o => o.Ignore())
                .ForMember(x => x.ItemCode,
                            o => o.MapFrom(s => s.RequireMaintenance == null ? "ไม่ระบุ" : $"{s.RequireMaintenance.Item.ItemCode}/{s.RequireMaintenance.Item.Name}"))
                .ForMember(x => x.ItemMainHasEmployees,o => o.Ignore())
                .ForMember(x => x.RequireMaintenance,o => o.Ignore())
                .ForMember(x => x.RequisitionStockSps,o => o.Ignore());

            #endregion

            #region AdjustStockSp
            CreateMap<AdjustStockSp, AdjustStockSpViewModel>()
                .ForMember(x => x.SparePartName,
                            o => o.MapFrom(s => s.SparePart == null ? "ไม่ระบุ" : s.SparePart.Name))
                .ForMember(x => x.SparePart, o => o.Ignore())
                .ForMember(x => x.MovementStockSp, o => o.Ignore());
            #endregion

            #region Item

            // Item
            CreateMap<Item, ItemViewModel>()
                .ForMember(x => x.ItemStatusString,
                            o => o.MapFrom(s => System.Enum.GetName(typeof(ItemStatus), s.ItemStatus)))
                .ForMember(x => x.BranchString,
                            o => o.MapFrom(s => s.Branch == null ? "ไม่ระบุ" : s.Branch.Name))
                // ItemType
                .ForMember(x => x.ItemTypeString,
                           o => o.MapFrom(s => s.ItemType == null ? "ไม่ระบุ" : s.ItemType.Name))
                .ForMember(x => x.Branch, o => o.Ignore())
                .ForMember(x => x.RequireMaintenances,o => o.Ignore())
                .ForMember(x => x.ItemImage, o => o.Ignore())
                .ForMember(x => x.ItemType, o => o.Ignore());
            CreateMap<ItemViewModel, Item>();

            #endregion Item

            #region ItemMainHasEmployee

            CreateMap<ItemMainHasEmployee, ItemMainHasEmployeeViewModel>()
                .ForMember(x => x.ItemMaintenance, o => o.Ignore());

            #endregion

            #region ItemType

            CreateMap<ItemType, ItemTypeViewModel>()
                .ForMember(x => x.Items, o => o.Ignore())
                .ForMember(x => x.WorkGroup, o => o.Ignore());

            #endregion

            #region ReceiveStockSp
            CreateMap<ReceiveStockSp, ReceiveStockSpViewModel>()
                .ForMember(x => x.SparePartName,
                            o => o.MapFrom(s => s.SparePart == null ? "ไม่ระบุ" : s.SparePart.Name))
                .ForMember(x => x.SparePart, o => o.Ignore())
                .ForMember(x => x.MovementStockSp, o => o.Ignore());
            #endregion

            #region RequireMaintenace
            // RequireMaintenance
            CreateMap<RequireMaintenance, RequireMaintenanceViewModel>()
                .ForMember(x => x.RequireStatusString,
                            o => o.MapFrom(s => System.Enum.GetName(typeof(RequireStatus), s.RequireStatus)))
                .ForMember(x => x.BranchString,
                            o => o.MapFrom(s => s.Branch != null ? s.Branch.Name : "ไม่ระบุ"))
                .ForMember(x => x.ItemCode,
                            o => o.MapFrom(s => s.Item != null ? $"{s.Item.ItemCode}/{s.Item.Name}" : "ไม่ระบุ"))
                .ForMember(x => x.ItemMaintenance,o => o.Ignore())
                .ForMember(x => x.RequireMaintenanceHasAttaches,o => o.Ignore())
                .ForMember(x => x.Branch, o => o.Ignore())
                .ForMember(x => x.Item, o => o.Ignore());
            CreateMap<RequireMaintenanceViewModel, RequireMaintenance>();
            #endregion

            #region RequisitionStockSp
            CreateMap<RequisitionStockSp, RequisitionStockSpViewModel>()
                .ForMember(x => x.SparePartName,
                        o => o.MapFrom(s => s.SparePart == null ? "ไม่ระบุ" : s.SparePart.Name))
                .ForMember(x => x.UnitPrice,
                        o => o.MapFrom(s => s.SparePart == null ? 0 : s.SparePart.UnitPrice))
                .ForMember(x => x.SparePart, o => o.Ignore())
                .ForMember(x => x.ItemMaintenance,o => o.Ignore())
                .ForMember(x => x.MovementStockSp, o => o.Ignore());
            #endregion

            #region SparePart
            //SparePart
            CreateMap<SparePart, SparePartViewModel>()
                .ForMember(x => x.RequisitionStockSps, o => o.Ignore())
                .ForMember(x => x.MovementStockSps, o => o.Ignore())
                .ForMember(x => x.ReceiveStockSps, o => o.Ignore())
                .ForMember(x => x.WorkGroup, o => o.Ignore());
            #endregion

            #region TypeMaintenance

            CreateMap<TypeMaintenance, TypeMaintenanceViewModel>()
                .ForMember(x => x.ItemMaintenances, o => o.Ignore())
                .ForMember(x => x.ItemType, o => o.Ignore());

            #endregion

            #region User

            //User
            CreateMap<User, UserViewModel>()
                // CuttingPlanNo
                .ForMember(x => x.NameThai,
                           o => o.MapFrom(s => s.EmpCodeNavigation == null ? "-" : $"คุณ{s.EmpCodeNavigation.NameThai}"))
                .ForMember(x => x.EmpCodeNavigation, o => o.Ignore());

            #endregion User

            #region WorkGroup

            CreateMap<WorkGroup, WorkGroupViewModel>()
                .ForMember(x => x.ItemTypes, o => o.Ignore())
                .ForMember(x => x.SpareParts, o => o.Ignore());

            #endregion

            #region WorkGroupMaintenance

            CreateMap<WorkGroupMaintenance, WorkGroupMaintenanceViewModel>()
                .ForMember(x => x.ItemMaintenances, o => o.Ignore());

            #endregion

            ///////////////
            /// Machine ///
            ///////////////
            #region Employee

            CreateMap<Employee, EmployeeViewModel>()
                .ForMember(x => x.GroupMisNavigation, o => o.Ignore())
                .ForMember(x => x.User,o => o.Ignore());

            CreateMap<EmployeeGroupMis, EmployeeGroupMisViewModel>()
                .ForMember(x => x.Employee, o => o.Ignore());

            #endregion
        }
    }
}
