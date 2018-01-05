using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Script.Serialization;
using JobSearchAPI.DBModels;
using JobSearchAPI.UserManager;
using Microsoft.AspNet.Identity;

namespace JobSearchAPI.Controllers
{
    [RoutePrefix("Account")]
    public class AccountController : ApiController
    {
        private AuthRepository _repo = null;

        public AccountController()
        {
            _repo=new AuthRepository();
        }

        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(User userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IdentityResult result = await _repo.RegisterUser(userModel);
            IHttpActionResult erroResult = GetErrorResult(result);
            if (erroResult != null)
            {
                return erroResult;
            }
            return Ok();
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }
            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("",error);
                    }
                }
                if (ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                return BadRequest(ModelState);
            }
            return null;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("FindUser")]

        public async Task<IHttpActionResult> FindUser()
        {
            try
            {
                var context = await Request.Content.ReadAsStringAsync();
                var type = Request.Content.Headers.ContentType;
                if (type.MediaType == "application/x-www-form-urlencoded")
                {
                    return BadRequest("Not support for x-www-form-urlencoded, please use json type");
                }
                var body = new JavaScriptSerializer().Deserialize<Dictionary<string, string>>(context);
                var username = body["username"];
                bool ret = await _repo.ExistUser(username);
                return Ok(ret);
            }
            catch (Exception e)
            {
                return BadRequest("Please include the parameter 'username'");
            }
           
        }
    }
}
