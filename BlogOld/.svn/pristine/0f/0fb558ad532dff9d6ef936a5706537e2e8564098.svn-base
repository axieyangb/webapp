using Newtonsoft.Json;

namespace Blog.Models.CalendarDataModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Calendar.EventUser")]
    public partial class EventUser
    {
        [Key]
        public int EventUserId { get; set; }
        public int? EventId { get; set; }

        public int? UserId { get; set; }

      
        [Column(Order = 0)]
        public byte Active { get; set; }

        
        [Column(Order = 1, TypeName = "datetime2")]
        public DateTime CreateDate { get; set; }

        [JsonIgnore]
        public virtual Event Event { get; set; }

        public virtual User User { get; set; }
    }
}
