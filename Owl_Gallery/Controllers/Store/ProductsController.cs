using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Owl_Gallery.Data;
using Owl_Gallery.Models;
using System.Collections.Generic;
using System.Linq;

namespace Owl_Gallery.Controllers.Store
{
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _ctx;
        public ProductsController(ApplicationDbContext ctx) => _ctx = ctx;

        // GET: /Products/Products?category=Rings&search=...
        public IActionResult Products(string category, string search)
        {
            var q = _ctx.Products.AsQueryable();

            if (!string.IsNullOrEmpty(category))
                q = q.Where(p => p.Category.Contains(category));

            if (!string.IsNullOrEmpty(search))
                q = q.Where(p => p.Name.Contains(search) || p.Category.Contains(search));


            ViewBag.Category = category;
            ViewBag.Search = search;

            return View(q.ToList());
        }

        // GET: /Products/Details/5
        public IActionResult Details(int id)
        {
            var product = _ctx.Products.Find(id);
            return product == null ? NotFound() : View(product);
        }

        [HttpGet]
        public JsonResult SearchLive(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Json(new List<object>());

            var results = _ctx.Products
                .Where(p => p.Name.Contains(query) || p.Category.Contains(query))
                .Select(p => new {
                    id = p.Id,
                    name = p.Name,
                    category = p.Category,
                    imageUrl = p.ImageUrl,   // (Optional if you want photo preview)
                    price = p.Price
                })
                .Take(10)
                .ToList();

            return Json(results);
        }


        // GET: /Products/Typeahead?q=...
        [HttpGet]
        public JsonResult Typeahead(string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return Json(new List<object>());

            var suggestions = _ctx.Products
                .Where(p => p.Name.Contains(q))
                .Select(p => new { p.Id, p.Name })
                .Take(10)
                .ToList();

            return Json(suggestions);
        }
    }
}
