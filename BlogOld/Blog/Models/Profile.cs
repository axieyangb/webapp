namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Blog.Profile")]
    public partial class Profile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long UserID { get; set; }

        [StringLength(200)]
        public string NickName { get; set; }

        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(200)]
        public string Email { get; set; }

        [StringLength(200)]
        public string ProfileImageName { get; set; }
        [StringLength(300)]
        public string Description { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CreateDate { get; set; }


        public DateTime? BirthDate { get; set; }

        [StringLength(200)]
        public string School { get; set; }

        [StringLength(200)]
        public string Website { get; set; }

        [StringLength(200)]
        public string Address { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime? LastUpdateDate { get; set; }

        public virtual Member Member { get; set; }

    }
}
