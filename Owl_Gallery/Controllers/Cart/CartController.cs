using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Owl_Gallery.Data;
using Owl_Gallery.Models;
using System.Security.Claims;

namespace Owl_Gallery.Controllers.Cart
{
    [Authorize]
    public class CartController : Controller
    {
        private readonly ApplicationDbContext _ctx;
        public CartController(ApplicationDbContext ctx) => _ctx = ctx;

        // GET /Cart
        [HttpGet]
        public IActionResult Index()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var items = _ctx.CartItems
                .Where(c => c.UserId == userId)
                .Select(c => new CartItem
                {
                    Id = c.Id,
                    ProductId = c.ProductId,
                    ProductName = c.ProductName,
                    Quantity = c.Quantity,
                    Product = c.Product
                })
                .ToList();

            return View(items);
        }

        // POST /Cart/Add
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Add(int productId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var product = _ctx.Products.Find(productId);

            if (product == null || product.Quantity <= 0)
            {
                TempData["Error"] = "This product is out of stock.";
                return Redirect(Request.Headers["Referer"].ToString());
            }

            var existing = _ctx.CartItems.SingleOrDefault(c => c.UserId == userId && c.ProductId == productId);

            if (existing != null)
            {
                if (existing.Quantity >= product.Quantity)
                {
                    TempData["Error"] = $"Only {product.Quantity} left in stock.";
                    return Redirect(Request.Headers["Referer"].ToString());
                }

                existing.Quantity++;
            }
            else
            {
                _ctx.CartItems.Add(new CartItem
                {
                    UserId = userId,
                    UserName = User.FindFirstValue(ClaimTypes.Name)!,
                    ProductId = productId,
                    ProductName = product.Name,
                    Quantity = 1
                });
            }

            _ctx.SaveChanges();
            return Redirect(Request.Headers["Referer"].ToString());
        }

        // POST /Cart/UpdateQuantity
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UpdateQuantity(int productId, int quantity)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var item = _ctx.CartItems.SingleOrDefault(c => c.UserId == userId && c.ProductId == productId);
            var product = _ctx.Products.Find(productId);

            if (item == null || product == null) return RedirectToAction(nameof(Index));

            if (quantity <= 0)
            {
                _ctx.CartItems.Remove(item);
            }
            else if (quantity > product.Quantity)
            {
                TempData["Error"] = $"Only {product.Quantity} left in stock.";
            }
            else
            {
                item.Quantity = quantity;
            }

            _ctx.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // POST /Cart/Remove
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Remove(int productId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var item = _ctx.CartItems.SingleOrDefault(c => c.UserId == userId && c.ProductId == productId);

            if (item != null)
            {
                _ctx.CartItems.Remove(item);
                _ctx.SaveChanges();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
