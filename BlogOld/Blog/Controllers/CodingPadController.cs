using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Blog.Helper;
using Blog.Models;
using Newtonsoft.Json;

namespace Blog.Controllers
{
    public class CodingPadController : Controller
    {
        // GET: CodingPad
        public async Task<ActionResult> Index(string id)
        {

            string userIdStr = Session["LoggedUserID"] as string;
            if (!string.IsNullOrEmpty(id))
            {
                using (var db = new BlogContext())
                {
                    int codeId;
                    if (int.TryParse(id, out codeId) && !string.IsNullOrEmpty(userIdStr))
                    {
                        long userId = long.Parse(userIdStr);
                        var code =
                            await db.SouceCode.FirstOrDefaultAsync(a => a.CodeID == codeId && a.CreateUser == userId && a.Active == 1);
                        code.ShortGuid = new GuidHelper.ShortGuid(code.CodeGuid);
                        return View(code);
                    }

                    try
                    {
                        GuidHelper.ShortGuid shortGuid = new GuidHelper.ShortGuid(id);

                        var code = await db.SouceCode.FirstOrDefaultAsync(a => a.CodeGuid == shortGuid.Guid && a.Shared == 1 && a.Active == 1);
                        code.ShortGuid = new GuidHelper.ShortGuid(code.CodeGuid);
                        return View(code);
                    }
                    catch (Exception e)
                    {
                        return View((SouceCode)null);
                    }
                  
                    
                }
            }
            return View((SouceCode)null);
        }

        [HttpPost]
        public async Task<string> RunCode(string codeEncoded, string language)
        {
            var codeDecoded = HttpUtility.HtmlDecode(codeEncoded);
            return await CodeHelper.GetIntance().RunCode(codeDecoded, language);
        }

        public async Task<string> GetMyCodes()
        {
            string userIdStr = Session["LoggedUserID"] as string;
            if (string.IsNullOrEmpty(userIdStr))
            {
                return null;
            }
            long userId = long.Parse(userIdStr);
            using (var db = new BlogContext())
            {
                List<SouceCode> codes = await db.SouceCode.Where(a => a.CreateUser == userId && a.Active == 1).ToListAsync();
                foreach (var code in codes)
                {
                    code.ShortGuid = new GuidHelper.ShortGuid(code.CodeGuid);
                }
                return JsonConvert.SerializeObject(codes);
            }
        }


        public async Task<string> SavingCode(string title, string codeEncoded, string languageName, int saveMode, long? codeId)
        {
            string userIdStr = Session["LoggedUserID"] as string;
            if (string.IsNullOrEmpty(userIdStr))
            {
                return "Error. You have not login yet, pleasee login first";
            }
            long userId = long.Parse(userIdStr);
            using (var db = new BlogContext())
            {
                SouceCode sourceCode = null;
                if (codeId != null && saveMode == 0)
                {
                    sourceCode = await db.SouceCode.FindAsync((long)codeId);
                }
                if (sourceCode == null)
                {
                    sourceCode = new SouceCode();
                    sourceCode.CodeGuid = Guid.NewGuid();
                    sourceCode.CreateDate = DateTime.Now;
                    sourceCode.CreateUser = userId;
                    sourceCode.Active = 1;
                    db.SouceCode.Add(sourceCode);
                }

                sourceCode.CodeContent = codeEncoded;
                sourceCode.CodeLanguage = languageName;
                sourceCode.CodeTitle = title;
                sourceCode.LastEditDate = DateTime.Now;
                await db.SaveChangesAsync();
                return JsonConvert.SerializeObject(sourceCode);
            }

        }

        public async Task DeleteCode(long codeId)
        {
            string userIdStr = Session["LoggedUserID"] as string;
            if (string.IsNullOrEmpty(userIdStr))
            {
                return;
            }
            long userId = long.Parse(userIdStr);
            using (var db = new BlogContext())
            {
                SouceCode delteCodeNode = await db.SouceCode.FindAsync(codeId);
                if (delteCodeNode != null && delteCodeNode.CreateUser == userId)
                {
                    delteCodeNode.Active = 0;
                    await db.SaveChangesAsync();
                }
            }
        }


        public async Task ShareCode(long codeId, int flag)
        {
            string userIdStr = Session["LoggedUserID"] as string;
            if (string.IsNullOrEmpty(userIdStr))
            {
                return;
            }
            long userId = long.Parse(userIdStr);
            using (var db = new BlogContext())
            {
                SouceCode shareCodeNode = await db.SouceCode.FindAsync(codeId);
                if (shareCodeNode != null && shareCodeNode.CreateUser == userId)
                {
                    shareCodeNode.Shared = (byte)(flag == 1 ? 1 : 0);
                    await db.SaveChangesAsync();
                }
            }
        }
    }
}