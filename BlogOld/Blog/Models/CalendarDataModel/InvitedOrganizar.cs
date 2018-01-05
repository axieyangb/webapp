namespace Blog.Models.CalendarDataModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Calendar.InvitedOrganizar")]
    public partial class InvitedOrganizar
    {
        [Key]
        public int InvitedId { get; set; }

        public int? SessionId { get; set; }

        public long? UserId { get; set; }

        public byte Active { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CreateDate { get; set; }
    }
}
