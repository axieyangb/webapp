
using Blog.Controllers;
using NUnit.Framework;

namespace BlogTest
{
    [TestFixture]
    public class WebControllerSendRequestTest
    {
        private WebCamController _webcamController;

        [SetUp]
        public void Initial()
        {
            _webcamController = new WebCamController();
        }

        [Test]
        public void TestSendRequest()
        {
            _webcamController.SendRequest("reset");
        }
    }
}
