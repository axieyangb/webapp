using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Blog.Helper;
using Blog.Models;
using Blog.Models.CalendarDataModel;
using Blog.Models.ViewModel;
using Newtonsoft.Json;

namespace Blog.Controllers
{
    public class CalendarController : Controller
    {
        // GET: Calender
        public async Task<ActionResult> Index(string id)
        {

            try
            {
                Guid oneGuid;
                var shortGuid = Guid.TryParse(id, out oneGuid) ? new GuidHelper.ShortGuid(oneGuid) : new GuidHelper.ShortGuid(id);
               
             
                using (var db = new CalendarContext())
                {

                    Session current =
                        await db.Sessions.FirstOrDefaultAsync(a => a.SessionGuid == shortGuid.Guid && a.Active == 1);

                    if (current != null)
                    {
                        ViewBag.CalendarSession = JsonConvert.SerializeObject(current);
                        return View();
                    }
                }
            }
            catch (Exception e)
            {
               //todo
            }
            return RedirectToAction("Index", "Home");
        }

        public async Task<string> GetEvents(string country, int month, int year,int sessionId, int onlyViewUserId)
        {
            List<EventViewModel> ret = new List<EventViewModel>();
            using (var db = new BlogContext())
            {
                var queryHoliday = db.HolidayLookUps.Where(a => a.DateStart.Month == month && a.DateStart.Year == year);
                if (!country.Equals("All"))
                {
                    queryHoliday = queryHoliday.Where(a => a.Region.Equals(country));
                }
                foreach (var holiday in await queryHoliday.ToListAsync())
                {
                    EventViewModel eventViewModel = new EventViewModel();
                    var date = holiday.DateStart;
                    eventViewModel.Day = date.Day;
                    eventViewModel.Month = date.Month;
                    eventViewModel.Year = date.Year;
                    eventViewModel.EventName = holiday.HolidayName;
                    eventViewModel.Color = "#4caf50";
                    eventViewModel.EventId = 0;
                    ret.Add(eventViewModel);
                }
            }
            using (var db = new CalendarContext())
            {

                var baseQueue = db.Events.Where(a => a.SessionId == sessionId && a.Active==1);
                #region no repeat event
                var queryEventNoRepeat = baseQueue.Where(a => a.Repeat == 0 && (a.StartYear == year && a.StartMonth == month ||
                                                                                a.EndYear == year && a.EndMonth== month));

                foreach (var eventObj in await queryEventNoRepeat.ToListAsync())
                {
                    AddToList(ret, eventObj, month, year, onlyViewUserId);
                }
                #endregion
                #region dailyRepeat
                var queryEventDailyRepeat =
                    baseQueue.Where(a => a.Active == 1 && a.Repeat == 1 && (a.StartYear<year || a.StartYear == year && a.StartMonth<=month));
                foreach (var eventObj in await queryEventDailyRepeat.ToListAsync())
                {
                    AddToList(ret, eventObj, month, year, onlyViewUserId);
                }
                #endregion
                #region weeklyRepeat 

                IQueryable<Event> queryEventWeeklyRepeat = baseQueue.Where(a => a.Active == 1  && a.Repeat == 7 && (a.StartYear < year || a.StartYear == year && a.StartMonth <= month));
                foreach (var eventObj in await queryEventWeeklyRepeat.ToListAsync())
                {
                    AddToList(ret, eventObj, month, year, onlyViewUserId);
                }
                #endregion
                #region monthlyrepeat
                var queryEventMonthlyRepeat = baseQueue.Where(a => a.Active == 1 && a.Session.Active == 1 && a.Repeat == -1 && (a.StartYear < year || a.StartYear == year && a.StartMonth <= month));
                foreach (var eventObj in await queryEventMonthlyRepeat.ToListAsync())
                {
                    AddToList(ret, eventObj, month, year, onlyViewUserId);
                }

                #endregion
            }


            return JsonConvert.SerializeObject(ret);
        }
        private void AddToList(List<EventViewModel> ret, Event eventObj, int month, int year,int onlyViewUserId)
        {
            if (onlyViewUserId > 0)
            {
                if (eventObj.EventUsers.Count(a => a.UserId == onlyViewUserId && a.Active==1) == 0)
                {
                    return;
                }
            }


            DateTime startDate;
            DateTime endDate;
            if (eventObj.Repeat == 0)
            {
                 startDate = new DateTime(eventObj.StartYear, eventObj.StartMonth, eventObj.StartDay);
                 endDate = new DateTime(eventObj.EndYear, eventObj.EndMonth, eventObj.EndDay);
                for (DateTime date = startDate; date <= endDate; date = date.AddDays(1))
                {
                    if (date.Year != year && date.Month != month) continue;
                    ret.Add(AssignToViewModel(eventObj, date));
                }
            }
            else if (eventObj.Repeat == -1)
            {
                var temp1 = new DateTime(year, month, eventObj.StartDay);
                var temp2 = new DateTime(eventObj.StartYear, eventObj.StartMonth, eventObj.StartDay);
                startDate = temp1 > temp2 ? temp1 : temp2;
                bool[] coverDays = new bool[DateTime.DaysInMonth(year,month)];
                int offsetSet = startDate.Day-1;
                for (int i = 0; i < coverDays.Length; i++)
                {
                    coverDays[(i + offsetSet) % coverDays.Length] = true;
                    if ((i + offsetSet) % coverDays.Length == eventObj.EndDay-1) break;
                }

                for (int i = 0; i < coverDays.Length; i++)
                {
                    var idx = (offsetSet + i) % coverDays.Length;
                    if (coverDays[idx])
                    {
                        ret.Add(AssignToViewModel(eventObj, new DateTime(year,month, idx + 1)));
                    }
                }
            }
            else if (eventObj.Repeat == 1)
            {
                var temp1 = new DateTime(year, month, 1);
                var temp2 = new DateTime(eventObj.StartYear, eventObj.StartMonth, eventObj.StartDay);
                startDate = temp1 > temp2 ? temp1 : temp2;
                endDate = new DateTime(year, month, 1).AddMonths(1);
                for (DateTime date = startDate; date <endDate; date = date.AddDays(1))
                {
                    ret.Add(AssignToViewModel(eventObj, date));
                }
            }
            else if(eventObj.Repeat==7)
            {
                var temp1 = new DateTime(year, month, 1);
                var temp2 = new DateTime(eventObj.StartYear, eventObj.StartMonth, eventObj.StartDay);
                startDate = temp1 > temp2 ? temp1 : temp2;
                endDate = new DateTime(year, month, 1).AddMonths(1);
                bool[] coverDays = new bool[7];
                int offsetSet = eventObj.StartDayOfWeek;
                for (int i = 0; i < coverDays.Length; i++)
                {
                    coverDays[(i + offsetSet) % 7] = true;
                    if ((i + offsetSet) % 7 == eventObj.EndDayOfWeek) break;
                }
                for (DateTime date = startDate; date < endDate; date = date.AddDays(1))
                {
                    if (coverDays[(int)date.DayOfWeek])
                    {
                        ret.Add(AssignToViewModel(eventObj, date));
                    }
                }
            }
            
        }
        private EventViewModel AssignToViewModel(Event eventObj, DateTime date)
        {

            EventViewModel eventViewModel = new EventViewModel();
            eventViewModel.Day = date.Day;
            eventViewModel.Month = date.Month;
            eventViewModel.Year = date.Year;
            eventViewModel.EventName = eventObj.EventName;
            eventViewModel.Color = eventObj.Color;
            eventViewModel.EventId = eventObj.EventId;
            return eventViewModel;
        }

        public async Task<bool> AddUser(User user)
        {
            if (user.SessionId == null) return false;
            if (!await PermissionCheck((int)user.SessionId)) return false;
            try
            {
                using (var db = new CalendarContext())
                {
                    user.Active = 1;
                    user.CreateDate = DateTime.Now;
                    db.Users.Add(user);
                    await db.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception e)
            {
                return false;
            }

        }

        public async Task<bool> UpdateUser(User user)
        {
            using (var db = new CalendarContext())
            {
                var userInDb = await db.Users.FirstOrDefaultAsync(a => a.Active == 1 && a.UserId == user.UserId );
                if (userInDb == null || userInDb.SessionId==null)
                {
                    return false;
                }
                if (!await PermissionCheck((int)userInDb.SessionId)) return false;
                userInDb.UserName = user.UserName;
                userInDb.Email = user.Email;
                userInDb.CellPhone = user.CellPhone;
                userInDb.PhoneCarrier = user.PhoneCarrier;
                userInDb.ReceiveEmailActive = user.ReceiveEmailActive;
                userInDb.ReceiveMessageActive = user.ReceiveMessageActive;
                await db.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> DeleteUser(int userId)
        {
            using (var db = new CalendarContext())
            {
                var userInDb = await db.Users.FirstOrDefaultAsync(a => a.Active == 1 && a.UserId == userId);
                if (userInDb == null|| userInDb.SessionId==null)
                {
                    return false;
                }
                if (!await PermissionCheck((int)userInDb.SessionId)) return false;
                userInDb.Active = 0;
                await db.SaveChangesAsync();
                return true;
            }
        }
        public async Task<string> GetUsersBySessionId(int sessionId)
        {
            using (var db = new CalendarContext())
            {
                List<User> users = await db.Users.Where(a => a.SessionId == sessionId && a.Active == 1 && a.Session.Active == 1).ToListAsync();
                return JsonConvert.SerializeObject(users);
            }
        }


        public async Task<bool> SaveEvent(Event eventObj)
        {
            if (eventObj.SessionId == null) return false;
            if (!await PermissionCheck((int)eventObj.SessionId)) return false;
            using (var db = new CalendarContext())
            {
                eventObj.CreateDate = DateTime.Now;
                eventObj.Active = 1;
                foreach (var eventUser in eventObj.EventUsers)
                {
                    eventUser.Active = 1;
                    eventUser.CreateDate = DateTime.Now;
                    db.EventUsers.Add(eventUser);
                }
                db.Events.Add(eventObj);
                await db.SaveChangesAsync();
            }
            return true;
        }


        public async Task<bool> EditEvent(Event eventObj)
        {
            if (!await PermissionCheck((int)eventObj.SessionId)) return false;
            using (var db = new CalendarContext())
            {
                Event eventObjInDb = await db.Events.FirstOrDefaultAsync(a => a.EventId == eventObj.EventId && a.Active == 1);
                if (eventObjInDb == null)
                {
                    return false;
                }
                syncEventModel(eventObjInDb, eventObj);
                HashSet<int?> userIdSets = new HashSet<int?>();
                foreach (var eventUser in eventObjInDb.EventUsers)
                {
                    if (eventUser.Active == 1)
                    {
                        userIdSets.Add(eventUser.UserId);
                    }
                   
                }
                foreach (var eventUser in eventObj.EventUsers)
                {
                    if (userIdSets.Contains(eventUser.UserId))
                    {
                        userIdSets.Remove(eventUser.UserId);
                    }
                    else
                    {
                        EventUser oneEventUser = await 
                            db.EventUsers.FirstOrDefaultAsync(
                                a => a.UserId == eventUser.UserId && a.EventId == eventObj.EventId);
                        if (oneEventUser != null)
                        {
                            oneEventUser.Active = 1;
                        }
                        else
                        {
                            oneEventUser = new EventUser();
                            oneEventUser.EventId = eventObj.EventId;
                            oneEventUser.UserId = eventUser.UserId;
                            oneEventUser.Active = 1;
                            db.EventUsers.Add(oneEventUser);
                        }
                    }
                }

                foreach (var userId in userIdSets)
                {
                   var eventUser = eventObjInDb.EventUsers.FirstOrDefault(a => a.EventId == eventObj.EventId && a.UserId == userId &&
                                                           a.Active == 1);
                    if (eventUser != null)
                    {
                        eventUser.Active = 0;
                    }
                   
                }
               await db.SaveChangesAsync();
            }
            return true;
        }

        private void syncEventModel(Event eventInDb, Event eventChanged)
        {
            eventInDb.EventName = eventChanged.EventName;
           

          
            if (eventChanged.Repeat == 1 )
            {
                eventInDb.StartHour = eventChanged.StartHour;
                eventInDb.StartMinute = eventChanged.StartMinute;
            }
            else if (eventChanged.Repeat == 7)
            {
                eventInDb.StartHour = eventChanged.StartHour;
                eventInDb.StartMinute = eventChanged.StartMinute;
                eventInDb.StartDayOfWeek = eventChanged.StartDayOfWeek;
            }
            else if (eventChanged.Repeat == -1)
            {
                eventInDb.StartHour = eventChanged.StartHour;
                eventInDb.StartMinute = eventChanged.StartMinute;
                eventInDb.StartDay = eventChanged.StartDay;
            }
            else if (eventChanged.Repeat == 0)
            {
                eventInDb.StartHour = eventChanged.StartHour;
                eventInDb.StartMinute = eventChanged.StartMinute;
                eventInDb.StartDay = eventChanged.StartDay;
                eventInDb.StartMonth = eventChanged.StartMonth;
                eventInDb.StartYear = eventChanged.StartYear;
            }
          
          

            eventInDb.EndYear = eventChanged.EndYear;
            eventInDb.EndMonth = eventChanged.EndMonth;
            eventInDb.EndDayOfWeek = eventChanged.EndDayOfWeek;
            eventInDb.EndDay = eventChanged.EndDay;
            eventInDb.EndHour = eventChanged.EndHour;
            eventInDb.EndMinute = eventChanged.EndMinute;
            eventInDb.Description = eventChanged.Description;
            eventInDb.Repeat = eventChanged.Repeat;
            eventInDb.Location = eventChanged.Location;
            eventInDb.Color = eventChanged.Color;
            eventInDb.EmailNotificationActive = eventChanged.EmailNotificationActive;
            eventInDb.EmailNotificationBeforeHour = eventChanged.EmailNotificationBeforeHour;
            eventInDb.EmailNotificationBeforeMinute = eventChanged.EmailNotificationBeforeMinute;
            eventInDb.MessageNotificationActive = eventChanged.MessageNotificationActive;
            eventInDb.MessageNotificationBeforeHour = eventChanged.MessageNotificationBeforeHour;
            eventInDb.MessageNotificationBeforeMinute = eventChanged.MessageNotificationBeforeMinute;
        }
        public async Task<string> GetEventDetail(int eventId)
        {
            using (var db = new CalendarContext())
            {
                Event eventObj = await db.Events.FirstOrDefaultAsync(a => a.EventId == eventId && a.Active == 1);
                return JsonConvert.SerializeObject(eventObj);
            }
        }

        public async Task<bool> DeleteEvent(int eventId)
        {
            using (var db = new CalendarContext())
            {
                Event eventObj = await db.Events.FirstOrDefaultAsync(a => a.EventId == eventId && a.Active == 1);
                if (eventObj == null ||eventObj.SessionId==null)
                {
                    return false;
                }
                if (!await PermissionCheck((int) eventObj.SessionId)) return false;
                foreach (var eventUser in eventObj.EventUsers)
                {
                    eventUser.Active = 0;
                }
                eventObj.Active = 0;
                await db.SaveChangesAsync();
                return true;

            }
        }


        public async Task<string> GetSessions()
        {
            if (Session["LoggedUserID"] == null)
                return "";
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            List<DashboardCalendarViewModel> ret = new List<DashboardCalendarViewModel>();
            using (var db = new CalendarContext())
            {
              List<Session> calendarSessionsCreateByOwn = await  db.Sessions.Where(a => a.Active == 1 && a.CreateUser == userId).ToListAsync();
                foreach (var session in calendarSessionsCreateByOwn)
                {
                    DashboardCalendarViewModel one = new DashboardCalendarViewModel();
                    one.SessionId = session.SessionId;
                    one.CreateDate = session.CreateDate;
                    one.Name = session.Name;
                    one.SessionGuid = new GuidHelper.ShortGuid(session.SessionGuid);
                    one.EventNum = session.Events.Count(a => a.Active == 1);
                    one.CalendarsNum = session.Users.Count(a => a.Active == 1);
                    one.IsCreator = true;
                   one.Invitors = await (from a in db.InvitedOrganizars
                        where a.Active == 1 && a.SessionId == session.SessionId
                        select new Invitor 
                    {
                        UserId =a.UserId
                    }).ToListAsync();
                    ret.Add(one);
                }
                List<InvitedOrganizar> invitedByOthers =
                    await db.InvitedOrganizars.Where(a => a.UserId == userId && a.Active == 1).ToListAsync();
                foreach (var oneInvite in invitedByOthers)
                {
                    Session oneSession =await  db.Sessions.FirstOrDefaultAsync(a => a.SessionId == oneInvite.SessionId && a.Active==1);
                    if (oneSession != null)
                    {
                        DashboardCalendarViewModel one = new DashboardCalendarViewModel();
                        one.SessionId = oneSession.SessionId;
                        one.CreateDate = oneSession.CreateDate;
                        one.Name = oneSession.Name;
                        one.SessionGuid = new GuidHelper.ShortGuid(oneSession.SessionGuid);
                        one.EventNum = oneSession.Events.Count(a => a.Active == 1);
                        one.CalendarsNum = oneSession.Users.Count(a => a.Active == 1);
                        one.IsCreator = false;
                        ret.Add(one);
                    }
                }
               
            }
            using (var db = new BlogContext())
            {
                foreach (var viewModel in ret)
                {
                    if (viewModel.IsCreator)
                    {
                        foreach (var oneInvitor in viewModel.Invitors)
                        {
                            oneInvitor.Name =await (from a in db.Members
                                where a.UserID == oneInvitor.UserId
                                select a.UserName).FirstOrDefaultAsync();
                        }
                    }
                }
            }
           
            return JsonConvert.SerializeObject(ret);
        }

        public async Task<string> DeleteSession(int sessionId)
        {
            if (Session["LoggedUserID"] == null)
                return "Error, you don't have permission to delete this session";
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            using (var db = new CalendarContext())
            {
                Session session =
                    await db.Sessions.FirstOrDefaultAsync(a => a.Active == 1 && a.CreateUser == userId && a.SessionId == sessionId);
                if (session == null)
                {
                    return "Error,could not find this session";
                }
                session.Active = 0;
                await db.SaveChangesAsync();
                return "Success, you have successfully delete the session";
            }
        }


        public async Task<bool> CreateSession(Session oneSession)
        {
            if (Session["LoggedUserID"] == null)
                return false;
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            using (var db = new CalendarContext())
            {
                oneSession.Active = 1;
                oneSession.SessionGuid = Guid.NewGuid();
                oneSession.CreateDate = DateTime.Now;
                oneSession.CreateUser = userId;
                db.Sessions.Add(oneSession);
                await db.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> UpdateSession(Session oneSession)
        {
            if (Session["LoggedUserID"] == null)
                return false;
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            using (var db = new CalendarContext())
            {
                var sessionInDb =await 
                    db.Sessions.FirstOrDefaultAsync(a => a.SessionId == oneSession.SessionId && a.Active == 1 && a.CreateUser ==userId);
                if (sessionInDb == null)
                {
                    return false;

                }
                sessionInDb.Name = oneSession.Name;
                await db.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> AddInvitor(long? userId,int sessionId)
        {
            if (userId == null) return false;
            using (var db = new CalendarContext())
            {
                InvitedOrganizar invitor =
                    await db.InvitedOrganizars.FirstOrDefaultAsync(a => a.UserId == userId && a.SessionId == sessionId);
                if (invitor == null)
                {
                    invitor = new InvitedOrganizar();
                    invitor.CreateDate= DateTime.Now;
                    invitor.UserId = userId;
                    invitor.SessionId = sessionId;
                    db.InvitedOrganizars.Add(invitor);
                }
                invitor.Active = 1;
                await db.SaveChangesAsync();
                return true;
            }
        }


        public async Task<bool> DeleteInvitor(long? userId, int sessionId)
        {
            using (var db = new CalendarContext())
            {
                var organizer =await db.InvitedOrganizars.FirstOrDefaultAsync(a => a.UserId == userId && a.SessionId == sessionId && a.Active==1);
                if (organizer == null)
                {
                    return false;
                }
                organizer.Active = 0;
               await db.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> ChangeSessionName(int sessionId, string sessionName)
        {
            using (var db = new CalendarContext())
            {
                var session =await db.Sessions.FirstOrDefaultAsync(a => a.SessionId == sessionId && a.Active == 1);
                if (session == null)
                {
                    return false;
                }
                session.Name = sessionName;
                await db.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> PermissionCheck(int sessionId)
        {
            if (Session["LoggedUserID"] == null)
                return false;
            long userId = int.Parse(Session["LoggedUserID"].ToString());
            using (var db = new CalendarContext())
            {
                var cnt =await (from s in db.Sessions
                    join org in db.InvitedOrganizars on s.SessionId equals org.SessionId
                    where s.Active == 1 && (s.CreateUser == userId || org.Active == 1 && org.UserId == userId)
                    select 1).CountAsync();
                return cnt != 0;
            }
        }
    }
}