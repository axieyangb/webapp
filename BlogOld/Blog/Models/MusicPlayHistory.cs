namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Blog.MusicPlayHistory")]
    public partial class MusicPlayHistory
    {
        [Key]
        public int ListId { get; set; }

        public long? UserId { get; set; }

        public int? MusicId { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? LastPlayedDate { get; set; }

    }
}
