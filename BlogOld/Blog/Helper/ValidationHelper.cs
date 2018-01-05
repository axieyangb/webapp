using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc.Routing;
using System.Web.Query.Dynamic;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Blog.Helper
{
    public class ValidationHelper
    {
        private string _siteKey;

        public ValidationHelper()
        {
            _siteKey = "6LfBjBEUAAAAADXXZR784a3tmFxLBJf1ovVVPQne";
        }
        public ValidationHelper(string siteKey)
        {
            _siteKey = siteKey;
        }

        public async Task<bool> GetResponse(string token,string ipAddress=null)
        {
            using (var client = new HttpClient())
            {
                var parameters = new Dictionary<string, string>
                {
                    {"secret", _siteKey},
                    {"response",token },
                    {"remoteip",ipAddress }
                };
                var content = new FormUrlEncodedContent(parameters);
                var res = await client.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);
                var responseString = await res.Content.ReadAsStringAsync();
                try
                {
                    var response = JObject.Parse(responseString);
                    return response["success"].Value<bool>();
                }
                catch (Exception)
                {

                    return false;
                }
               
                
            }
        }
    }
}