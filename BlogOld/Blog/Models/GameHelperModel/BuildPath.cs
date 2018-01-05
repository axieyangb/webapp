namespace Blog.Models.GameHelperModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SimCity.BuildPath")]
    public partial class BuildPath
    {
        [Key]
        public int PathId { get; set; }

        public int ItemId { get; set; }

        public int ComponentId { get; set; }

        public int Count { get; set; }

        public virtual Item Item { get; set; }

        public virtual Item Item1 { get; set; }
    }
}
