using Newtonsoft.Json;

namespace Blog.Models.CalendarDataModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Calendar.Event")]
    public partial class Event
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Event()
        {
            EventUsers = new HashSet<EventUser>();
        }

        public int EventId { get; set; }

        public int? SessionId { get; set; }

        [Required]
        [StringLength(100)]
        public string EventName { get; set; }

        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int StartDayOfWeek { get; set; }

        public int StartDay { get; set; }
        public int StartHour { get; set; }

        public int StartMinute { get; set; }

        public int EndYear { get; set; }
        public int EndMonth { get; set; }

        public int EndDayOfWeek { get; set; }

        public int EndDay { get; set; }

        public int EndHour { get; set; }

        public int EndMinute { get; set; }

        public string Description { get; set; }

        public int Repeat { get; set; }

        [StringLength(50)]
        public string Location { get; set; }

        [StringLength(7)]
        public string Color { get; set; }

        public byte EmailNotificationActive { get; set; }

        public int? EmailNotificationBeforeHour { get; set; }

        public int? EmailNotificationBeforeMinute { get; set; }

        public byte MessageNotificationActive { get; set; }

        public int? MessageNotificationBeforeHour { get; set; }

        public int? MessageNotificationBeforeMinute { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime CreateDate { get; set; }

        public virtual Session Session { get; set; }

        public byte Active { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<EventUser> EventUsers { get; set; }
    }
}
