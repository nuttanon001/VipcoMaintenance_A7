using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace VipcoMaintenance.Helper
{
    public class HelpersClass<TEntity> where TEntity : class
    {
        public TEntity AddHourMethod(TEntity entity)
        {
            var properties = entity.GetType().GetProperties();
            foreach (var property in properties)
            {
                if (property.PropertyType == typeof(DateTime))
                {
                    if (property.GetValue(entity, null) != null)
                    {
                        property.SetValue(entity, ((DateTime)property.GetValue(entity, null)).AddHours(7), null);
                    }
                }
                else if (property.PropertyType == typeof(Nullable<DateTime>))
                {
                    if (property.GetValue(entity, null) != null)
                    {
                        property.SetValue(entity, ((DateTime)property.GetValue(entity, null)).AddHours(7), null);
                    }
                }
            }
            return entity;
        }
    }

    public class EmailClass 
    {
        public EmailClass() { }
        /// <summary>
        /// Send email to email address
        /// </summary>
        /// <param name="MailFrom">Email From</param>
        /// <param name="NameFrom">Name for From</param>
        /// <param name="MailTos">List of email address</param>
        /// <param name="Message"></param>
        /// <param name="Subject"></param>
        /// <returns></returns>
        public async Task<bool> SendMailMessage(string MailFrom, string NameFrom, List<string> MailTos, string Message, string Subject)
        {
            try
            {
                using (SmtpClient client = new SmtpClient("mail.vipco-thai.com", 25)
                {
                    UseDefaultCredentials = false,
                    EnableSsl = false,
                })
                {
                    MailMessage mailMessage = new MailMessage
                    {
                        From = new MailAddress(MailFrom, NameFrom),
                        IsBodyHtml = true,
                        Body = Message,
                        Subject = Subject,
                    };
                    // Add MailAddress To
                    MailTos.ForEach(item => mailMessage.To.Add(item));
                    await client.SendMailAsync(mailMessage);
                    return true;
                }
            }
            catch (Exception ex)
            {
                var message = $"Has error {ex.ToString()}";
            }
            return false;
        }

        private bool invalid = false;
        private string DomainMapper(Match match)
        {
            // IdnMapping class with default property values.
            IdnMapping idn = new IdnMapping();

            string domainName = match.Groups[2].Value;
            try
            {
                domainName = idn.GetAscii(domainName);
            }
            catch (ArgumentException)
            {
                invalid = true;
            }
            return match.Groups[1].Value + domainName;
        }
        /// <summary>
        /// Valid email address.
        /// </summary>
        /// <param name="strIn">Email address to check</param>
        /// <returns></returns>
        public bool IsValidEmail(string strIn)
        {
            invalid = false;
            if (String.IsNullOrEmpty(strIn))
                return false;

            // Use IdnMapping class to convert Unicode domain names.
            try
            {
                strIn = Regex.Replace(strIn, @"(@)(.+)$", this.DomainMapper,
                                      RegexOptions.None, TimeSpan.FromMilliseconds(200));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }

            if (invalid)
                return false;

            // Return true if strIn is in valid e-mail format.
            try
            {
                return Regex.IsMatch(strIn,
                      @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                      @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                      RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }
    }
}
