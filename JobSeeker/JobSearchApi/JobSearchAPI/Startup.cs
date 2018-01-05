using Microsoft.Owin;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Cors;
using System.Web.Http;
using System.Web.Http.Cors;
using JobSearchAPI.UserManager;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;

[assembly:OwinStartup(typeof(JobSearchAPI.Startup))]
namespace JobSearchAPI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();
            ConfigureOAuth(app);
            ConfigureCors(app, config);
            WebApiConfig.Register(config);
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);
        }

        public void ConfigureOAuth(IAppBuilder app)
        {
            OAuthAuthorizationServerOptions oAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider =new SimpleAuthorizationServerProvider()
            };

            //Token Generation
            app.UseOAuthAuthorizationServer(oAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }

        public void ConfigureCors(IAppBuilder app, HttpConfiguration config)
        {
            var corsPolicy=new EnableCorsAttribute("*","*", "GET, POST, OPTIONS, PUT, DELETE");
            app.UseCors(new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = request =>
                        request.Path.Value == "/token" ?
                        corsPolicy.GetCorsPolicyAsync(null, CancellationToken.None) :
                        Task.FromResult<CorsPolicy>(null)
                }
            });
            config.EnableCors(corsPolicy);
        }
    }
}