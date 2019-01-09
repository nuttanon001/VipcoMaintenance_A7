using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.Services.ExcelExportServices
{
    public class HtmlDocumentService
    {
        public HtmlNode Create(string HtmlCode)
        {
            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(HtmlCode);
            return htmlDoc.DocumentNode;
        }
    }
}
