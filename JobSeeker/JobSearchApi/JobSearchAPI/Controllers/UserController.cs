using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using JobSearchAPI.DBModels;
using Microsoft.AspNet.Identity;

namespace JobSearchAPI.Controllers
{
    [Authorize]
    [RoutePrefix("User")]
    public class UserController : ApiController
    {
        private readonly string _userId;
        public UserController()
        {
            try
            {
                _userId = ((ClaimsIdentity)User.Identity).Claims.First(a => a.Type == "id").Value;
            }
            catch (Exception)
            {
                //
            }
         
        }
          [HttpPut]
        [Route("{id:int}/{operation}")]
        public async Task<IHttpActionResult> Put(int id, string operation)
        {
            if (operation.ToLower() == "visited")
            {
                return await UpdateVistitedNumLogged(id);
            }
            if (operation.ToLower() == "thumbsup")
            {
                return await UpdateThumbsUpNumLogged(id);
            }
            if (operation.ToLower() == "unavailable")
            {
                return await UpdateUnavailableNumLogged(id);
            }
              if (operation.ToLower() == "applied")
              {
                  return await MarkedAsAppliedLogged(id);
              }
              return BadRequest();
        }
        private async Task<IHttpActionResult> UpdateVistitedNumLogged(int id)
        {
            using (var data = new JobContext())
            {
                try
                {
                    data.Jobs.First(a => a.Id == id).VisitedNum++;
                    if (!data.UserActions.Any(a => a.JobId == id && a.UserId == _userId && a.ActionType == 1))
                    {
                        var newAction = new UserAction
                        {
                            ActionType = 1,
                            UserId = _userId,
                            JobId = id,
                            IsValid = 1,
                            CreateDate = DateTime.Now
                        };
                        data.UserActions.Add(newAction);
                    }
                    await data.SaveChangesAsync();
                    return Ok();
                }
                catch (Exception e)
                {
                    return BadRequest(e.ToString());
                }

            }
        }
        public async Task<IHttpActionResult> UpdateThumbsUpNumLogged(int id)
        {
            using (var data = new JobContext())
            {
                try
                {
                    if (!data.UserActions.Any(a => a.JobId == id && a.UserId == _userId && a.ActionType == 3))
                    {
                        var newAction = new UserAction
                        {
                            ActionType = 3,
                            UserId = _userId,
                            JobId = id,
                            IsValid = 1,
                            CreateDate = DateTime.Now
                        };
                        data.UserActions.Add(newAction);
                    }
                    data.Jobs.First(a => a.Id == id).ThumbsUpNum++;
                    await data.SaveChangesAsync();
                    return Ok();
                }
                catch (Exception)
                {
                    return BadRequest();
                }

            }


        }
        public async Task<IHttpActionResult> UpdateUnavailableNumLogged(int id)
        {
            using (var data = new JobContext())
            {
                var detail = data.Jobs.FirstOrDefault(a => a.Id == id);
                if (detail == null) return BadRequest(); 
                if (!data.UserActions.Any(a => a.JobId == id && a.UserId == _userId && a.ActionType == 2))
                    {
                        var newAction = new UserAction
                        {
                            ActionType = 2,
                            UserId = _userId,
                            JobId = id,
                            IsValid = 1,
                            CreateDate = DateTime.Now
                        };
                        data.UserActions.Add(newAction);
                    }
                    detail.InValidNum++;
                    await data.SaveChangesAsync();
                return Ok();

            }
        }

        public async Task<IHttpActionResult> MarkedAsAppliedLogged(int id)
        {
            using (var data = new JobContext())
            {
                var detail = data.Jobs.FirstOrDefault(a => a.Id == id);
                if (detail == null) return BadRequest();
                if (!data.UserActions.Any(a => a.JobId == id && a.UserId == _userId && a.ActionType == 4))
                {
                    var newAction = new UserAction
                    {
                        ActionType = 4,
                        UserId = _userId,
                        JobId = id,
                        IsValid = 1,
                        CreateDate = DateTime.Now
                    };
                    data.UserActions.Add(newAction);
                    await data.SaveChangesAsync();
                }
                
                return Ok();

            }
        }

        [HttpGet]
        [Route("")]
        [ResponseType(typeof(Job))]
        public async Task<IHttpActionResult> Get(string keywords)
        {
            if (string.IsNullOrEmpty(keywords))
                return BadRequest();
            using (var data = new JobContext())
            {
                return Ok(await data.SearchJobsByKeywordsLogged(keywords,_userId));
            }
        }


    }
}
