using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Blog.Models.GameHelperViewModel.SimCityViewModel
{
    public class ItemViewModel
    {
        public ItemViewModel()
        {
            Components = new List<Component>();
        }
        public int ItemId { get; set; }

        public string ItemName { get; set; }

        public int SellMaxValue { get; set; }
        public int RawMeterialsProducingTime { get; set; }
        public int AssemblyingTime { get; set; }
        public int TotalTime { get; set; }
        public double DollarPerMinute { get; set; }

        public string ImageName { get; set; }
        public CommericalBuildingViewModel Building { get; set; }
        public List<Component> Components { get; set; }
    }

    public class Component
    {
        public int ItemId { get; set; }

        public string ItemName { get; set; }
        public string ImageName { get; set; }

        public int Count { get; set; }
    }

    public class ItemDetailViewModel
    {
        public ItemDetailViewModel()
        {
            Components = new List<ItemDetailViewModel>();
        }
        public int ItemId { get; set; }
        public string ItemName { get; set; }

        public int SellPrice { get; set; }
        public string ImageName { get; set; }

        public int BuildTime { get; set; }
        public int TotalTime { get; set; }

        public int Count { get; set; }

        public List<ItemDetailViewModel> Components { get; set; }
    }
}