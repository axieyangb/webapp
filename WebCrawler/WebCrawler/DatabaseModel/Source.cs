namespace WebCrawler.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Source
    {
        public int id { get; set; }

        public int? SiteId { get; set; }

        [StringLength(50)]
        public string SourceTypeName { get; set; }

        [StringLength(1000)]
        public string SourceUrl { get; set; }

        [StringLength(500)]
        public string Title { get; set; }

        [StringLength(50)]
        public string Duration { get; set; }

        public int? IsVisited { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CreateDate { get; set; }
    }
}
