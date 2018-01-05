﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobSeeker.BAL;
using JobSeeker.DBModel;
using System.Web;

namespace JobSeeker
{
    public class Program
    {
        //static string FILENAME ="Files\\entryFile.txt";
        static void Main(string[] args)
        {
            try
            {
                //LinkedList<string> roots = ReadEntryFile();
                Entry();
            }
            catch (Exception e)
            {
                Console.WriteLine("Func name: "+e.TargetSite.Name+" | Error Info :"+e);
                throw new Exception(e.ToString());
            }

        }

        //static LinkedList<string> ReadEntryFile()
        //{
        //    var currentPath = Directory.GetCurrentDirectory();
        //    var filePath = Path.Combine(currentPath, FILENAME);
        //    if (!File.Exists(filePath)) throw new Exception("Entry file not exist");
        //    LinkedList<string> entryUrls = new LinkedList<string>();
        //    using (var st = new StreamReader(filePath))
        //    {
        //        while (!st.EndOfStream)
        //        {
        //            entryUrls.AddLast(st.ReadLine());
        //        }
        //    }
        //    return entryUrls;
        //}


        static LinkedList<string> ReadEntriesFromDbMonster()
        {
            LinkedList<string> ret=new LinkedList<string>();
            using (var data = new JobContext())
            {
                var sources = data.Sources.ToList();
                foreach (var source in sources)
                {
                    var urlEntry = "https://www.monster.com/jobs/search/?q=" + source.Keywords + "&where=" +
                                   source.Location;
                    ret.AddLast(urlEntry);
                }
                return ret;
            }
        }
        static LinkedList<string> ReadEntriesFromDbIndeed()
        {
            LinkedList<string> ret = new LinkedList<string>();
            using (var data = new JobContext())
            {
                var sources = data.Sources.ToList();
                foreach (var source in sources)
                {
                    var urlEntry = "http://www.indeed.com/jobs?q=" + HttpUtility.UrlEncode(source.Keywords) + "&l=" +
                                   HttpUtility.UrlEncode(source.Location);
                    ret.AddLast(urlEntry);
                }
                return ret;
            }
        }
        static void Entry()
        {

            try
            {
                Entry entry = new Entry(ReadEntriesFromDbMonster(), Types.WebsiteType.Monster);
                entry.Start();
            }
            catch (Exception e)
            {
                // ignored
            }
            try
            {
                Entry entry = new Entry(ReadEntriesFromDbIndeed(), Types.WebsiteType.Indeed);
                entry.Start();
            }
            catch (Exception)
            {
                // ignored
            }
        }
    }
}
