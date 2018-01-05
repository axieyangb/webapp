using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Blog.Models;
using System.Text;
using System.Data.Entity;
using System.IO;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Blog.Helper;
using Blog.Models.ViewModel;

namespace Blog.Controllers
{
    public class AdminController : Controller
    {
        //
        // GET: /Admin/
        private static string _passPhrase = "helloworld";
        // This size of the IV (in bytes) must = (keysize / 8).  Default keysize is 256, so the IV must be
        // 32 bytes long.  Using a 16 character string here gives us 32 bytes when converted to a byte array.
        private  const string InitVector = "jerryyu1xyelul88";
        // This constant is used to determine the keysize of the encryption algorithm
        private   const int Keysize = 256;
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(Member member)
        {
            if (ModelState.IsValid)
            {
                using (BlogContext db = new BlogContext(ConfigurationManager.ConnectionStrings["BlogContext"].ConnectionString))
                {
                    string hashPass=EncryptString(member.Password,_passPhrase);
                    var v = db.Members.FirstOrDefault(a => a.UserName.Equals(member.UserName) && a.Password.Equals(hashPass));
                    if (v == null)
                    {
                        HttpContext.Response.Cookies.Remove("expireTime");
                        return View(member);
                    }
                    Session["LoggedUserID"] = v.UserID.ToString();
     
                    Session["LoggedUserName"] = string.IsNullOrEmpty(v.Profile.NickName) ? v.UserName : v.Profile.NickName;
                    return RedirectToAction("Index", "Dashboard");
                }
            }
            return View(member);
        }
        [HttpGet]

        public ActionResult Signup()
        {

            return View();
        }

        [HttpGet]
        public ActionResult ForgetPassword()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Signup(RegisiterViewModel registerModel)
        {
            registerModel.ReturnInfo = new RegisterReturnViewModel();
            if (ModelState.IsValid)
            {
                ValidationHelper helper = new ValidationHelper();
                bool isValid = false;
                var address = Request.ServerVariables["REMOTE_ADDR"];
                if (registerModel.Token != null)
                {
                    isValid = await helper.GetResponse(registerModel.Token, address);
                }
                if (!isValid)
                {
                    registerModel.ReturnInfo.IsFormValid = false;
                    registerModel.ReturnInfo.ErrorInfo.Add("Token", "Please activate the Recapcha before submitting the form");
                    return View(registerModel);
                }
                using (BlogContext db = new BlogContext(ConfigurationManager.ConnectionStrings["BlogContext"].ConnectionString))
                {
                    if (db.Members.FirstOrDefault(a => a.UserName.Equals(registerModel.UserName)) != null)
                    {
                        registerModel.ReturnInfo.IsFormValid = false;
                        registerModel.ReturnInfo.ErrorInfo.Add("User", "This user name has been existed in our system, please try another one");
                        return View(registerModel);
                    }
                    Member member = new Member
                    {
                        Profile = new Profile(),
                        UserName = registerModel.UserName,
                        isActive = 1,
                        Password = EncryptString(registerModel.Password, _passPhrase),
                        CreateDate = DateTime.Now
                    };
                    member.Profile.CreateDate = DateTime.Now;
                    member.Profile.NickName = registerModel.NickName;
                    member.Profile.Email = registerModel.Email;
                        
                    db.Members.Add(member);
                    db.SaveChanges();
                    registerModel.ReturnInfo.SucessInfo = "Congratulation ! New Member " +
                                                          (String.IsNullOrEmpty(member.Profile.NickName)
                                                              ? member.UserName
                                                              : member.Profile.NickName) +
                                                          ". Please <b><a href='/Admin/Login'>Click Here to Login</a></b>";
                    registerModel.ReturnInfo.IsFormValid = true;
                    return View(registerModel);
                }
            }
            registerModel.ReturnInfo.IsFormValid = false;
            foreach (var keyValuePair in ModelState)
            {
                if (keyValuePair.Value.Errors.Count > 0)
                {
                    registerModel.ReturnInfo.ErrorInfo.Add(keyValuePair.Key,keyValuePair.Value.Errors[0].ErrorMessage);
                }
               
            }
            return View(registerModel);
        }
        public ActionResult Logout()
        {
            Session.Clear();
            Session.Abandon();
            return RedirectToAction("Index", "Home");
        }

        public bool AddSession()
        {
            int timeout = System.Web.HttpContext.Current.Session.Timeout;
            if (timeout >= 40) return false;
            System.Web.HttpContext.Current.Session.Timeout += 20;
            return true;

        }

        public int GetSession()
        {
            return System.Web.HttpContext.Current.Session.Timeout;
        }

        //Encrypt
        public  string EncryptString(string plainText, string passPhrase)
        {
            byte[] initVectorBytes = Encoding.UTF8.GetBytes(InitVector);
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            PasswordDeriveBytes password = new PasswordDeriveBytes(passPhrase, null);
#pragma warning disable 618
            byte[] keyBytes = password.GetBytes(Keysize / 8);
#pragma warning restore 618
            RijndaelManaged symmetricKey = new RijndaelManaged {Mode = CipherMode.CBC};
            ICryptoTransform encryptor = symmetricKey.CreateEncryptor(keyBytes, initVectorBytes);
            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write);
            cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
            cryptoStream.FlushFinalBlock();
            byte[] cipherTextBytes = memoryStream.ToArray();
            memoryStream.Close();
            cryptoStream.Close();
            return Convert.ToBase64String(cipherTextBytes);
        }
        //Decrypt
        public  string DecryptString(string cipherText, string passPhrase)
        {
            byte[] initVectorBytes = Encoding.ASCII.GetBytes(InitVector);
            byte[] cipherTextBytes = Convert.FromBase64String(cipherText);
            PasswordDeriveBytes password = new PasswordDeriveBytes(passPhrase, null);
#pragma warning disable 618
            byte[] keyBytes = password.GetBytes(Keysize / 8);
#pragma warning restore 618
            RijndaelManaged symmetricKey = new RijndaelManaged {Mode = CipherMode.CBC};
            ICryptoTransform decryptor = symmetricKey.CreateDecryptor(keyBytes, initVectorBytes);
            MemoryStream memoryStream = new MemoryStream(cipherTextBytes);
            CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            byte[] plainTextBytes = new byte[cipherTextBytes.Length];
            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            memoryStream.Close();
            cryptoStream.Close();
            return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
        }

    }
}
