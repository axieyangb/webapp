namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Blog.MusicFavorite")]
    public partial class MusicFavorite
    {
        [Key]
        public int ListId { get; set; }

        public long? UserId { get; set; }

        public int? MusicId { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CreateDate { get; set; }

        public int? isValid { get; set; }

    }
}
