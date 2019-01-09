using System;
using System.Collections.Generic;
using System.Linq;

namespace VipcoMaintenance.Helper
{
    public class LoopEachDate
    {
        public List<DateTime?> EachDate(DateTime Start, DateTime End)
        {
            var EachDate = Enumerable.Range(0, (End - Start).Days + 1)
                                             .Select(index => new DateTime?(Start.AddDays(index)))
                                             .TakeWhile(date => date <= End)
                                             .ToList();
            return EachDate;
        }
    }
}