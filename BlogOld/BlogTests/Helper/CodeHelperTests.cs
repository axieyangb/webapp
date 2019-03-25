using Microsoft.VisualStudio.TestTools.UnitTesting;
using Blog.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Helper.Tests
{
    [TestClass()]
    public class CodeHelperTests
    {
        [TestMethod()]
        public async void GetIntanceTest()
        {
            String codeStr = "import java.io.*; "+

"public class myCode "+
  "      { "+
  "          public static void main(String[] args) throws java.lang.Exception "+
 "           {        " +"                System.out.println(\"Hello Java\"); "+

 "   } " +
  "  }";
            String res = await CodeHelper.GetIntance().RunCode(codeStr, "java");
            Console.Out.WriteLine(res);
        }

    }
}