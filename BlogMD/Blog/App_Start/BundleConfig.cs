﻿using System.Web;
using System.Web.Optimization;

namespace Blog
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/nprogress.min.js",
                        "~/Scripts/JqueryRotate/JqueryRotate.js",
                        "~/Scripts/WebView/Global/Site.js",
                        "~/Scripts/enhance_material.js",
                        "~/Scripts/jquery.cookie-1.4.1.min.js"
                        ));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //            "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                "~/Content/nprogress.css",
                "~/Content/Fonts.css",
                "~/Content/animate.css",
                      "~/Content/site.css",
                     "~/Content/enhance_mdl_grid.css"));
            BundleTable.EnableOptimizations = true;
        }
    }
}
