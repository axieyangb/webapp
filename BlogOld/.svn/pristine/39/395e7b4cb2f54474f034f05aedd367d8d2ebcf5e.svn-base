using Microsoft.VisualStudio.TestTools.UnitTesting;
using Blog.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Blog.Helper.Tests
{
    [TestClass()]
    public class ValidationHelperTests
    {
        [TestMethod()]
        public async Task GetResponseTest()
        {
            ValidationHelper oneHelper=new ValidationHelper();
            string response =
                "03AHJ_VuuDd92kGw8eTu_zbbZ5jdnSXj0iry7c-OeyOZ5QLyfX057vRfSR_6DIZmQX7T6PHHSzZsAcW6A94WDZf7imSnXoBXqkuv5gx3hKdfGU8XlPn9yxP-fRFpqQSVNlThEcGkb7bpT_CiXdrB0x5jAUe2ca6dKE9wrYTdtqQWX0PjiGr21PXAQ6pmjeCvR1Lk7mHxPqvfQ6629lLF4GDNv5kFeVckfAnUbrgHEsRW8D_SSEr6fjCRlXw2rhweplQx6nkJ4etwctl3DDNsclDZ9whWFmkGTYCwDM-ek7ybnmmzGNNVltGxpBS7OFQMZmERRj-9wHhLS3PwUBf74_pjC_QaGxdT1gEwjGM_ab33vLeQ3SR3uwRiyFTgMhDKuTaBxMRfdUy2k3ieawbUlMf9qzJKgSBmelDcr3xBQ_tGxhcJUI9bc5xihGojn18CiMHyhWRlPMQHaFaZQN0I9RhyTwKxdBw_trL9YlFi-yqPawCUUYB4QsBGhfDVvtJGUooq_-p43RRP05ohKVhbe3Pqw906HAfSRVaZp9u5igQKYLtPmJWACWxushK1Zv7BiEUq_Yk2miDmlkE-fg7HgbSC-oBLkQkN5KUGrfaxzHQqxCWWgeJk_jcr6woGYCfDuCiBYE9eSWH7rg5gj8FokqhEUUbCAz3xHGeGHgIGXdIDRU_ysnqKAftegErpCAnGsbV1_gYCjmh-u2Seh8zUkhndrk-xm8pzkqPZ01Qy_gclQGPGfzpkN5gTG2cYu8YJSO0TTFEcThm_ZujP7oS0JzqjsYUl6SxNxaU_HvD2TAaQnEKM8j8E1J47fgeiY1G8DQqJa4kZmWrGrfgMxAxUNs84gFoE85IGnAjfI1K8T7tlz_A5bffqBGU2NQLlu8ADgBA68LfUN5UH-PDV00lQwtLlxad5cn3gP1hRjrMvbFmdHzKPgYPeWiD4gUV11flwSfiWEajpQo_LG2PE79K0p7Bumxk3_qgcYL55OADX5p9GeO_vzsxvCsUzaPZHcxjK7sN9jlVjXqSXgxjmoRQ0FVrP0RV5NxgIyN_Y2KIsRW7vUIs1gqBfn-heE";
            bool res = await oneHelper.GetResponse(response);
                Assert.IsTrue(res);
        }

        [TestMethod()]
        public void DeserializeObjectTest()
        {
            string jsonString =
                "{\n  \"success\": true,\n  \"challenge_ts\": \"2017-01-12T17:03:34Z\",\n  \"hostname\": \"www.nowtoshare.com\"\n}";
            string oneAnother= "{" +
                               "\"success\": true," +
                               "\"challenge_ts\": \"2017-01-12T17:03:34Z\"," +
                               "\"hostname\": \"www.nowtoshare.com\"" +
                               "}";
     
            var jsonData = JObject.Parse(jsonString);
            Assert.IsTrue(jsonData["success"].Value<bool>());
        }
    }
}