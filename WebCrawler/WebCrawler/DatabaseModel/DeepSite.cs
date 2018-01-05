namespace WebCrawler.DatabaseModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class DeepSite
    {
        public int id { get; set; }

        [StringLength(1000)]
        public string Url { get; set; }

        public int? IsVisited { get; set; }

        [StringLength(255)]
        public string DomainName { get; set; }

        public int? Depth { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CreateDate { get; set; }
    }
}
