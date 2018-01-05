namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SyncUp.AttachFiles")]
    public partial class AttachFile
    {
        [Key]
        public int FileId { get; set; }

        [StringLength(50)]
        public string CarName { get; set; }

        [StringLength(50)]
        public string FileName { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CreateDate { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? EmailReceivedDate { get; set; }
    }
}
