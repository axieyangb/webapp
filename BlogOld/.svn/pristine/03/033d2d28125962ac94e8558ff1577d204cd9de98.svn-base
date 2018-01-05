using System.Web.Script.Serialization;
using Newtonsoft.Json;

namespace Blog.Models.CalendarDataModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Calendar.User")]
    public partial class User
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public User()
        {
            EventUsers = new HashSet<EventUser>();
        }

        public int UserId { get; set; }

        public int? SessionId { get; set; }

        [Required]
        [StringLength(20)]
        public string UserName { get; set; }

        [StringLength(50)]
        public string Email { get; set; }

        [StringLength(15)]
        public string CellPhone { get; set; }

        [StringLength(20)]
        public string PhoneCarrier { get; set; }

        public byte ReceiveEmailActive { get; set; }

        public byte ReceiveMessageActive { get; set; }

        public byte Active { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime CreateDate { get; set; }

      
        public virtual Session Session { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        [JsonIgnore]
        public virtual ICollection<EventUser> EventUsers { get; set; }
    }
}
