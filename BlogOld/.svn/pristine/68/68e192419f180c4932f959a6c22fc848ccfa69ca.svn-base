using Newtonsoft.Json;

namespace Blog.Models.GameHelperModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SimCity.Items")]
    public partial class Item
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Item()
        {
            BuildPaths = new HashSet<BuildPath>();
            BuildPaths1 = new HashSet<BuildPath>();
        }

        public int ItemId { get; set; }

        [StringLength(50)]
        public string ItemName { get; set; }

        public int SellMaxValue { get; set; }

        [StringLength(200)]
        public string MeterialsRequiredDesc { get; set; }
        public int RawMeterialsProducingTime { get; set; }

        public int AssemblyingTime { get; set; }

        public int TotalTime { get; set; }

        public double DollarPerMinute { get; set; }

        public int BuildingId { get; set; }

        public int Level { get; set; }

        public string ImageName { get; set; }

        [JsonIgnore]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BuildPath> BuildPaths { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        [JsonIgnore]
        public virtual ICollection<BuildPath> BuildPaths1 { get; set; }

        public virtual CommercialBuilding CommercialBuilding { get; set; }
    }
}
