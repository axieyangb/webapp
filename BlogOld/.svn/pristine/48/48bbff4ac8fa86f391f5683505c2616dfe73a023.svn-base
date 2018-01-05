using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Blog.Models.GameHelperModel;
using Blog.Models.GameHelperViewModel.SimCityViewModel;
using Newtonsoft.Json;

namespace Blog.Controllers
{
    public class GameHelperController : Controller
    {
        // GET: GameHelper
        public ActionResult Index()
        {
            if (Session["LoggedUserID"] == null)
                return RedirectToAction("Login", "Admin");
            return View();
        }

        public ActionResult SimCity()
        {
            if (Session["LoggedUserID"] == null)
                return RedirectToAction("Login", "Admin");
            return View();
        }

        public async Task<string> SimCityFetchItems()
        {

            using (var db = new GameHelperDataContext())
            {
                List<Item> items = await db.Items.ToListAsync();
                List<CommercialBuilding> buildings = await db.CommercialBuildings.ToListAsync();
                Dictionary<int, ItemViewModel> itemSet = new Dictionary<int, ItemViewModel>();
                foreach (var item in items)
                {

                    ItemViewModel itemViewModel = new ItemViewModel();
                    itemViewModel.ItemId = item.ItemId;
                    itemViewModel.ItemName = item.ItemName;
                    itemViewModel.SellMaxValue = item.SellMaxValue;
                    itemViewModel.RawMeterialsProducingTime = item.RawMeterialsProducingTime;
                    itemViewModel.AssemblyingTime = item.AssemblyingTime;
                    itemViewModel.TotalTime = item.TotalTime;
                    itemViewModel.DollarPerMinute = item.TotalTime;
                    itemViewModel.ImageName = item.ImageName;
                    itemViewModel.Building = new CommericalBuildingViewModel();
                    itemViewModel.Building.BuildingId = item.BuildingId;
                    CommercialBuilding building = buildings.FirstOrDefault(a => a.BuildingId == item.BuildingId);
                    if (building != null)
                    {
                        itemViewModel.Building.BuildingName = building.BuildingName;
                        itemViewModel.Building.Price = building.Price;
                        itemViewModel.Building.UnlockLevel = building.UnlockLevel;
                    }
                    itemSet.Add(item.ItemId, itemViewModel);
                }

                foreach (var itemViewModel in itemSet.Values)
                {
                    List<BuildPath> components = await db.BuildPaths.Where(a => a.ItemId == itemViewModel.ItemId).ToListAsync();
                    foreach (var oneComponent in components)
                    {
                        Component component = new Component();
                        component.ItemId = itemSet[oneComponent.ComponentId].ItemId;
                        component.ItemName = itemSet[oneComponent.ComponentId].ItemName;
                        component.ImageName = itemSet[oneComponent.ComponentId].ImageName;
                        component.Count = oneComponent.Count;
                        itemViewModel.Components.Add(component);
                    }
                }


                return JsonConvert.SerializeObject(itemSet.Values);
            }
        }

        public async Task<string> SimCityFetchPathByItemId(int itemId)
        {
            using (var db = new GameHelperDataContext())
            {
                ItemDetailViewModel root = new ItemDetailViewModel();
                Item itemRoot = await db.Items.FirstOrDefaultAsync(a => a.ItemId == itemId);
                if (itemRoot != null)
                {
                    root.ItemId = itemRoot.ItemId;
                    root.BuildTime = itemRoot.AssemblyingTime;
                    root.Count = 1;
                    root.SellPrice = itemRoot.SellMaxValue;
                    root.ImageName = itemRoot.ImageName;
                    root.ItemName = itemRoot.ItemName;
                    root.TotalTime = itemRoot.TotalTime;
                    List<BuildPath> paths =await db.BuildPaths.Where(a => a.ItemId == root.ItemId).ToListAsync();

                    foreach (var path in paths)
                    {
                        root.Components.Add(await BuildTree(path, db));
                    }
                }
                return JsonConvert.SerializeObject(root);
            }
        }

        public async Task<ItemDetailViewModel> BuildTree(BuildPath buildPath, GameHelperDataContext db)
        {
            ItemDetailViewModel current = new ItemDetailViewModel();
            Item itemCurrent = await db.Items.FirstAsync(a => a.ItemId == buildPath.ComponentId);
            current.ItemId = itemCurrent.ItemId;
            current.BuildTime = itemCurrent.AssemblyingTime;
            current.SellPrice = itemCurrent.SellMaxValue;
            current.Count = buildPath.Count;
            current.ImageName = itemCurrent.ImageName;
            current.ItemName = itemCurrent.ItemName;
            current.TotalTime = itemCurrent.TotalTime;
            List<BuildPath> paths =await db.BuildPaths.Where(a => a.ItemId == buildPath.ComponentId).ToListAsync();
            foreach (var path in paths)
            {
                current.Components.Add(await BuildTree(path, db));
            }
            return current;
        }
    }
}