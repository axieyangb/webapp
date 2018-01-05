using System.Web.UI.WebControls;

namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Blog.Music")]
    public partial class Music
    {
       public Music()
        {
        }

        [Key]
        public int ListId { get; set; }

        [StringLength(100)]
        public string MusicExternalId { get; set; }

        [StringLength(255)]
        public string MusicName { get; set; }

        [StringLength(255)]
        public string Artist { get; set; }

        [StringLength(255)]
        public string Album { get; set; }

        public int? Rate { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CreateDate { get; set; }

        [StringLength(500)]
        public string Url { get; set; }

        [StringLength(500)]
        public string ImgUrl { get; set; }

        [Column(TypeName = "xml")]
        public string Lyric { get; set; }

    }
}
