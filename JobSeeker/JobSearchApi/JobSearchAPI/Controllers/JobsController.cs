using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using System.Web.Http.Results;
using JobSearchAPI.BALModels;
using JobSearchAPI.DBModels;

namespace JobSearchAPI.Controllers
{
    [RoutePrefix("jobs")]
    public class JobsController : ApiController
    {
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(Job))]
        public async Task<IHttpActionResult> Get()
        {
            return await Get(num: 0);
        }
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(Job))]
        public async Task<IHttpActionResult> Get(int? num)
        {
            using (var data = new JobContext())
            {

                return Ok(await data.GetJobs(num));
            }
        }
        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(Job))]
        public async Task<IHttpActionResult> Get(int id)
        {
            using (var data = new JobContext())
            {
                var job = await (from j in data.Jobs where j.Id == id select j).FirstOrDefaultAsync();
                if (job == null)
                    return NotFound();
                return Ok(job);
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
              return  Ok(await data.SearchJobsByKeywords(keywords));
            }
        }

        [HttpPut]
        [Route("{id:int}/{operation}")]
        public async Task<IHttpActionResult> Put(int id,string operation)
        {
            if (operation.ToLower() == "visited")
            {
                return await UpdateVistitedNum(id);
            }
            if (operation.ToLower() == "thumbsup")
            {
                return await UpdateThumbsUpNum(id);
            }
            if (operation.ToLower() == "unavailable")
            {
                return await UpdateUnavailableNum(id);
            }
            return BadRequest();
        }

        private async Task<IHttpActionResult> UpdateVistitedNum(int id)
        {
            using (var data = new JobContext())
            {
                try
                {
                    data.Jobs.First(a => a.Id == id).VisitedNum++;
                    await data.SaveChangesAsync();
                    return  Ok();
                }
                catch (Exception e)
                {
                    return BadRequest(e.ToString());
                }

            }
        }

        public async Task<IHttpActionResult> UpdateThumbsUpNum(int id)
        {
            using (var data = new JobContext())
            {
                try
                {
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
        public async Task<IHttpActionResult> UpdateUnavailableNum(int id)
        {
            using (var data = new JobContext())
            {
                var detail = data.Jobs.FirstOrDefault(a => a.Id == id);
                if (detail != null)
                {
                    detail.InValidNum++;
                   await data.SaveChangesAsync();
                    return Ok();
                }
                return BadRequest();

            }
        }

        //private string GetUserIp()
        //{
        //    string visitorsIpAddr = string.Empty;
        //    if (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
        //    {
        //        visitorsIpAddr = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
        //    }
        //    else if (HttpContext.Current.Request.UserHostAddress?.Length != 0)
        //    {
        //        visitorsIpAddr = HttpContext.Current.Request.UserHostAddress;
        //    }
        //    return visitorsIpAddr;
        //}

    }

  
}
