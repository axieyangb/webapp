using Newtonsoft.Json;

namespace Blog.Models.GameHelperModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SimCity.CommercialBuildings")]
    public partial class CommercialBuilding
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CommercialBuilding()
        {
            Items = new HashSet<Item>();
        }

        [Key]
        public int BuildingId { get; set; }

        [Required]
        [StringLength(50)]
        public string BuildingName { get; set; }

        public int UnlockLevel { get; set; }

        public int Price { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        [JsonIgnore]
        public virtual ICollection<Item> Items { get; set; }
    }
}
