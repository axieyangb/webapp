using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Blog
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
               "Sitemap",
                "sitemap.xml",
                 new { Controller = "Home", action = "SitemapXml" }
            );
            routes.MapRoute(
                name: "ArticleFilters",
                url: "{lang}/Home/Index/{tagId}",
                defaults: new { controller = "Home", action = "Index", tagid = UrlParameter.Optional, lang = "en" }
            );

            routes.MapRoute(
               name: "Blog",
               url: "{lang}/Article/{action}/{ArticleID}",
               defaults: new { controller = "Article", action = "Index", ArticleID = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "CodingPadDefault",
                url: "{lang}/CodingPad/{action}/{id}",
                defaults: new { controller = "CodingPad", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "CodingPad",
                url: "{lang}/CodingPad/{id}",
                defaults: new { controller = "CodingPad", action = "Index", lang = "en", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "CalendarDefault",
                url: "{lang}/Calendar/{action}/{id}",
                defaults: new { controller = "Calendar", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "Calendar",
                url: "{lang}/Calendar/{id}",
                defaults: new { controller = "Calendar", action = "Index", lang = "en", id = UrlParameter.Optional }
            );
            routes.MapRoute(
               name: "GalleryDefault",
               url: "{lang}/Gallery",
               defaults: new { controller = "Gallery", action = "Index" }
            );
            routes.MapRoute(
            name: "GalleryIndex",
            url: "{lang}/Gallery/Index",
            defaults: new { controller = "Gallery", action = "Index", lang = "en" }
         );
            routes.MapRoute(
      name: "MusicIndex",
      url: "{lang}/Music",
      defaults: new { controller = "Music", action = "Index", lang = "en" }
   );
            routes.MapRoute(
            name: "PlaygroundDefault",
            url: "{lang}/Playground/{action}/{parameters}",
            defaults: new { controller = "Playground", action = "Index", parameters = UrlParameter.Optional, lang = "en" }
            );
            routes.MapRoute(
                 name: "PlaygroundIndex",
                 url: "{lang}/Playground",
                 defaults: new { controller = "Playground", action = "Index", lang = "en" }
              );
            routes.MapRoute(
              name: "WebcamIndex",
              url: "{lang}/WebCam",
              defaults: new { controller = "WebCam", action = "Index", lang = "en" }
           );
            routes.MapRoute(
         name: "WebcamDefault",
         url: "{lang}/WebCam/{action}/{parameters}",
         defaults: new { controller = "WebCam", action = "Index", parameters = UrlParameter.Optional, lang = "en" }
         );
            routes.MapRoute(
         name: "AboutMeDefault",
         url: "{lang}/AboutMe/{action}/{parameters}",
         defaults: new { controller = "Home", action = "AboutMe", parameters = UrlParameter.Optional, lang = "en" }
         );
            routes.MapRoute(
                 name: "AboutMeIndex",
                 url: "{lang}/AboutMe",
                 defaults: new { controller = "Home", action = "AboutMe", lang = "en" }
              );
            routes.MapRoute(
         name: "LoginDefault",
         url: "{lang}/Admin/{action}/{parameters}",
         defaults: new { controller = "Admin", action = "Login", parameters = UrlParameter.Optional, lang = "en" }
         );
            routes.MapRoute(
                name: "DashBoard",
                url: "{lang}/Dashboard/{action}/{parameters}",
                defaults: new { controller = "DashBoard", action = "Index", parameters = UrlParameter.Optional }
                );
            routes.MapRoute(
             name: "ChineseLanguage",
             url: "zh/{controller}/{action}/{id}",
             defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional, lang = "zh" }
         );
            routes.MapRoute(
            name: "EnglishLanguage",
            url: "en/{controller}/{action}/{id}",
            defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional, lang = "en" }
        );

            routes.MapRoute(
               name: "DefaultLanguage",
               url: "{controller}/{action}/{id}",
               defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional, lang = "en" }
                );
            routes.MapRoute(
                name: "Default",
                url: "{lang}/{controller}/{action}/{id}",
                defaults: new { lang = "en", controller = "Home", action = "Index", id = UrlParameter.Optional }
            );



        }
    }
}