using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using VipcoMaintenance.ViewModels;

namespace VipcoMaintenance.Services.ExcelExportServices
{
    public interface IHelperService
    {
        string ConvertHtmlToText(string HtmlCode);

        MemoryStream CreateExcelFile(DataTable table, string sheetName);

        MemoryStream CreateExcelFileMuiltSheets(List<MuiltSheetViewModel> muiltSheets);
    }
}
