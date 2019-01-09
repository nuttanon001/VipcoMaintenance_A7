using System.Collections.Generic;

namespace VipcoMaintenance.ViewModels
{
    public class EmailViewModel
    {
        public string MailFrom { get; set; }
        public string NameFrom { get; set; }
        public List<string> MailTos { get; set; }
        public string Message { get; set; }
        public string Subject { get; set; }
    }
}