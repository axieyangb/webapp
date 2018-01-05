﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web.Mvc;

namespace Blog.AppCode
{
    public class LocalizationAttribute : ActionFilterAttribute
    {
        private readonly string _defaultLanguage;

        public LocalizationAttribute(string defaultLanguage)
        {
            _defaultLanguage = defaultLanguage;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string lang = (string) filterContext.RouteData.Values["lang"] ?? _defaultLanguage;
            if (lang != _defaultLanguage)
            {
                try
                {
                    Thread.CurrentThread.CurrentCulture =Thread.CurrentThread.CurrentUICulture = new CultureInfo(lang);
                }
                catch (Exception e)
                {
                    throw new NotSupportedException(string.Format("ERROR: Invalid language code '{0}'.", lang));
                }
            }
        }
    }
}