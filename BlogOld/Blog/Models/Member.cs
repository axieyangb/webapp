namespace Blog.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Blog.Member")]
    public partial class Member
    {
        [Key]
        public long UserID { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        public byte isActive { get; set; }

        public DateTime? CreateDate { get; set; }

        public virtual Profile Profile { get; set; }
    }
}
