using Microsoft.AspNetCore.Mvc;
using Owl_Gallery.Data;
using Owl_Gallery.Models;
using System.Linq;
using System.Security.Claims;

namespace Owl_Gallery.Controllers
{
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _ctx;
        public AdminController(ApplicationDbContext ctx) => _ctx = ctx;

        // Dashboard
        public IActionResult Index()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail != "admin@gmail.com")
            {
                return Forbid();
            }

            ViewBag.TotalProducts = _ctx.Products.Count();
            ViewBag.TotalUsers = _ctx.Registers.Count();
            ViewBag.TotalOrders = _ctx.Orders.Count();

            return View();
        }

        // PRODUCTS
        public IActionResult ManageProducts(int page = 1, int pageSize = 10)
        {
            var totalProducts = _ctx.Products.Count();
            var products = _ctx.Products
                .OrderBy(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.TotalPages = (int)Math.Ceiling((double)totalProducts / pageSize);
            ViewBag.CurrentPage = page;
            return View(products);
        }

        [HttpGet]
        public IActionResult CreateProduct() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult CreateProduct(Product model)
        {
            if (!ModelState.IsValid)
                return View(model);

            _ctx.Products.Add(model);
            _ctx.SaveChanges();
            TempData["success"] = "Product created successfully!";
            return RedirectToAction("ManageProducts");
        }

        [HttpGet]
        public IActionResult EditProduct(int id)
        {
            var product = _ctx.Products.Find(id);
            if (product == null) return NotFound();
            return View(product);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult EditProduct(Product updatedProduct)
        {
            if (!ModelState.IsValid)
                return View(updatedProduct);

            var productInDb = _ctx.Products.FirstOrDefault(p => p.Id == updatedProduct.Id);
            if (productInDb == null) return NotFound();

            productInDb.Name = updatedProduct.Name;
            productInDb.Category = updatedProduct.Category;
            productInDb.Price = updatedProduct.Price;
            productInDb.Quantity = updatedProduct.Quantity;
            if (!string.IsNullOrWhiteSpace(updatedProduct.ImageUrl))
                productInDb.ImageUrl = updatedProduct.ImageUrl;

            _ctx.SaveChanges();
            TempData["success"] = "Product updated successfully!";
            return RedirectToAction("ManageProducts");
        }

        [HttpPost]
        public IActionResult DeleteProduct(int id)
        {
            var product = _ctx.Products.Find(id);
            if (product == null) return NotFound();

            _ctx.Products.Remove(product);
            _ctx.SaveChanges();
            TempData["success"] = "Product deleted successfully!";
            return RedirectToAction("ManageProducts");
        }

        // USERS
        public IActionResult ManageUsers(int page = 1, int pageSize = 10)
        {
            var totalUsers = _ctx.Registers.Count();
            var users = _ctx.Registers
                .OrderBy(u => u.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.TotalPages = (int)Math.Ceiling((double)totalUsers / pageSize);
            ViewBag.CurrentPage = page;
            return View(users);
        }

        [HttpGet]
        public IActionResult CreateUser() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult CreateUser(Register model)
        {
            if (!ModelState.IsValid)
                return View(model);

            // Check if email already exists
            bool emailExists = _ctx.Registers.Any(u => u.Email == model.Email);
            if (emailExists)
            {
                ModelState.AddModelError("Email", "This email is already registered.");
                return View(model);
            }

            _ctx.Registers.Add(model);
            _ctx.SaveChanges();
            TempData["success"] = "User created successfully!";
            return RedirectToAction("ManageUsers");
        }


        [HttpPost]
        public IActionResult DeleteUser(int id)
        {
            var user = _ctx.Registers.Find(id);
            if (user == null) return NotFound();

            _ctx.Registers.Remove(user);
            _ctx.SaveChanges();
            TempData["success"] = "User deleted successfully!";
            return RedirectToAction("ManageUsers");
        }

        // ORDERS
        public IActionResult ManageOrders(int page = 1, int pageSize = 10)
        {
            var totalOrders = _ctx.Orders.Count();
            var orders = _ctx.Orders
                .OrderBy(o => o.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.TotalPages = (int)Math.Ceiling((double)totalOrders / pageSize);
            ViewBag.CurrentPage = page;
            return View(orders);
        }

        [HttpPost]
        public IActionResult DeleteOrder(int id)
        {
            var order = _ctx.Orders.Find(id);
            if (order == null) return NotFound();

            _ctx.Orders.Remove(order);
            _ctx.SaveChanges();
            TempData["success"] = "Order deleted successfully!";
            return RedirectToAction("ManageOrders");
        }
    }
}
