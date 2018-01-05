﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using JobSearchAPI.DBModels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace JobSearchAPI.UserManager
{
    public class AuthRepository:IDisposable
    {
        private AuthContext _ctx;
        private UserManager<IdentityUser> _userManager;

        public AuthRepository()
        {
            _ctx=new AuthContext();
            _userManager=new UserManager<IdentityUser>(new UserStore<IdentityUser>(_ctx));
        }

        public async Task<IdentityResult> RegisterUser(User userModel)
        {
            IdentityUser user = new IdentityUser
            {
                UserName = userModel.UserName,
                Email = userModel.Email,
                PhoneNumber = userModel.PhoneNumber
            };
            var result = await _userManager.CreateAsync(user,userModel.Password);
            return result;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = await _userManager.FindAsync(userName, password);
            return user;
        }

        public async Task<bool> ExistUser(string userName)
        {
            IdentityUser user= await _userManager.FindByNameAsync(userName);
            return user != null;
        }
        public void Dispose()
        {
           _ctx.Dispose();
            _userManager.Dispose();
        }
    }
}