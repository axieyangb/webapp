namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Blog.PopularMusic")]
    public partial class PopularMusic
    {
        [Key]
        public int CategoryId { get; set; }

        [StringLength(500)]
        public string CategoryName { get; set; }

        [Column(TypeName = "xml")]
        public string MusicList { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CreateDate { get; set; }
    }
}
