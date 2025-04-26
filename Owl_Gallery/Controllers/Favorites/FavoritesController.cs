using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Owl_Gallery.Data;
using Owl_Gallery.Models;

namespace Owl_Gallery.Controllers.Favorites
{
    [Authorize]
    public class FavoritesController : Controller
    {
        private readonly ApplicationDbContext _ctx;
        public FavoritesController(ApplicationDbContext ctx)
            => _ctx = ctx;

        // GET /Favorites
        public IActionResult Index()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var products = _ctx.Favorites
                               .Where(f => f.UserId == userId)
                               .Include(f => f.Product)
                               .Select(f => f.Product)
                               .ToList();
            return View(products);
        }

        // POST /Favorites/Add
        [HttpPost, ValidateAntiForgeryToken]
        public IActionResult Add(int productId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (!_ctx.Favorites.Any(f => f.UserId == userId && f.ProductId == productId))
            {
                _ctx.Favorites.Add(new Favorite {
                    UserId    = userId,
                    ProductId = productId
                });
                _ctx.SaveChanges();
            }
            // Redirect back to the page that called Add (e.g. Products)
            return RedirectToAction("Products", "Products");
        }

        // POST /Favorites/Remove
        [HttpPost, ValidateAntiForgeryToken]
        public IActionResult Remove(int productId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var fav = _ctx.Favorites
                          .SingleOrDefault(f => f.UserId == userId && f.ProductId == productId);
            if (fav != null)
            {
                _ctx.Favorites.Remove(fav);
                _ctx.SaveChanges();
            }

            // **Crucial**: stay on YOUR own Index
            return RedirectToAction(nameof(Index));
        }
    }
}
