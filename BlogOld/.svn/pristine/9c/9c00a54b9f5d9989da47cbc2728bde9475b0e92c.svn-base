using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Blog.Models.ViewModel
{
    public class RegisiterViewModel
    {
        [Required(ErrorMessage = "Please provide a valid username", AllowEmptyStrings = false)]
        public string UserName { set; get; }
        [Required(ErrorMessage = "Please provide a valid password", AllowEmptyStrings = false)]
        public string Password { set; get; }
        public string Description { set; get; }
        public string Token { get; set; }
        [Required(ErrorMessage = "Please provide a valid email", AllowEmptyStrings = false)]
        public string Email { set; get; }
        public string NickName { set; get; }
        public byte IsActive { set; get; }

        public RegisterReturnViewModel ReturnInfo { get; set; }
    }

    public class RegisterReturnViewModel
    {
        public bool IsFormValid { get; set; }
        public string SucessInfo { get; set; }
        public Dictionary<string,string> ErrorInfo { get; set; }

        public RegisterReturnViewModel()
        {
            ErrorInfo = new Dictionary<string, string>();
        }
    }
}