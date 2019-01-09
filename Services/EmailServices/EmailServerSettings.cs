using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMaintenance.Services.EmailServices
{
    public class EmailServerSettings
    {
        public EmailServerSettings(string host, int port)
        {
            Host = host;
            Port = port;
        }
        public string Host { get; }
        public int Port { get; }
    }
}
