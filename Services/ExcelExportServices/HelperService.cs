using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using VipcoMaintenance.ViewModels;

namespace VipcoMaintenance.Services.ExcelExportServices
{
    public class HelperService : IHelperService
    {
        private readonly HtmlDocumentService htmlDocument;
        private readonly ExcelWorkBookService excelService;

        public HelperService(HtmlDocumentService _htmlDocument, ExcelWorkBookService _excelService)
        {
            this.htmlDocument = _htmlDocument;
            this.excelService = _excelService;
        }

        public string ConvertHtmlToText(string HtmlCode)
        {
            var htmlBody = this.htmlDocument.Create(HtmlCode);
            // return htmlBody.OuterHtml;
            var sb = new StringBuilder();
            foreach (var node in htmlBody.DescendantsAndSelf())
            {
                if (!node.HasChildNodes)
                {
                    string text = node.InnerText;
                    text = text.Replace("&nbsp;", "");

                    if (!string.IsNullOrEmpty(text))
                        sb.AppendLine(text.Trim());
                }
            }
            return sb.ToString();
        }

        public MemoryStream CreateExcelFile(DataTable table, string sheetName)
        {
            var memory = new MemoryStream();

            using (var wb = this.excelService.Create())
            {
                var wsFreeze = wb.Worksheets.Add(table, sheetName);
                wsFreeze.Columns().AdjustToContents();
                wsFreeze.SheetView.FreezeRows(1);
                wb.SaveAs(memory);
            }
            memory.Position = 0;
            return memory;
        }

        public MemoryStream CreateExcelFileMuiltSheets(List<MuiltSheetViewModel> muiltSheets)
        {
            var memory = new MemoryStream();

            using (var wb = this.excelService.Create())
            {
                foreach (var item in muiltSheets)
                {
                    var wsFreeze = wb.Worksheets.Add(item.Tables, item.SheetName);
                    wsFreeze.Columns().AdjustToContents();
                    wsFreeze.SheetView.FreezeRows(1);
                }

                wb.SaveAs(memory);
            }
            memory.Position = 0;
            return memory;
        }
    }
}