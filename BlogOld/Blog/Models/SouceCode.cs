using Blog.Helper;

namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Blog.SouceCode")]
    public partial class SouceCode
    {
        [Key]
        public int CodeID { get; set; }

        public Guid CodeGuid { get; set; }
        [NotMapped]
        public GuidHelper.ShortGuid ShortGuid { get; set; }
        [Required]
        [StringLength(200)]
        public string CodeTitle { get; set; }

        public string CodeContent { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime CreateDate { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? LastEditDate { get; set; }

        public long? CreateUser { get; set; }

        [StringLength(20)]
        public string CodeLanguage { get; set; }

        public byte Shared { get; set; }

        public byte Active { get; set; }
    }
}
