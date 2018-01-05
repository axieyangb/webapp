namespace JobSearchAPI.DBModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("JobSeeker.UserAction")]
    public  class UserAction
    {
        public int Id { get; set; }

        public int? ActionType { get; set; }

        [StringLength(128)]
        public string UserId { get; set; }

        public int? JobId { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CreateDate { get; set; }

        public int? IsValid { get; set; }
    }
}
