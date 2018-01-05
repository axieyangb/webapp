using Newtonsoft.Json;

namespace Blog.Models.CalendarDataModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Calendar.Session")]
    public partial class Session
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Session()
        {
            Events = new HashSet<Event>();
            Users = new HashSet<User>();
        }

        public int SessionId { get; set; }

        public Guid SessionGuid { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public long CreateUser { get; set; }

        public byte Active { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime CreateDate { get; set; }


        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        [JsonIgnore]
        public virtual ICollection<Event> Events { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        [JsonIgnore]
        public virtual ICollection<User> Users { get; set; }
    }
}
