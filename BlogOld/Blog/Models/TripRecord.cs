namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SyncUp.TripRecord")]
    public partial class TripRecord
    {
        [Key]
        public int TripId { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? StartTime { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? EndTime { get; set; }

        public int? Minutes { get; set; }

        public decimal? Miles { get; set; }

        [StringLength(300)]
        public string StartAddress { get; set; }

        [StringLength(300)]
        public string EndAddress { get; set; }
    }
}
