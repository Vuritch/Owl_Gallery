using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Owl_Gallery.Data;
using Owl_Gallery.Models;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Owl_Gallery.ViewModels;
namespace Owl_Gallery.Controllers
{
    public class IndexController : Controller
    {
        private readonly ILogger<IndexController> _logger;

        public IndexController(ILogger<IndexController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }

    public class LoginController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LoginController> _logger;

        public LoginController(ApplicationDbContext context, ILogger<LoginController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var user = _context.Registers
                .SingleOrDefault(u => u.Email == model.Email && u.Password == model.Password);

            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Invalid email or password.");
                return View(model);
            }

            // Build the claims
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Email, user.Email)
        };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            // Create auth cookie with "Remember Me" support
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = model.RememberMe,
                ExpiresUtc = model.RememberMe ? DateTime.UtcNow.AddDays(14) : (DateTime?)null
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                authProperties
            );

            return RedirectToAction("Index", "Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Index");
        }
    }
    public class RegisterController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<RegisterController> _logger;

        public RegisterController(
            ApplicationDbContext context,
            ILogger<RegisterController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Register(Register model)
        {
            if (!ModelState.IsValid)
                return View(model);

            /* ① duplicate-email check */
            if (_context.Registers.Any(r => r.Email == model.Email))
            {
                ModelState.AddModelError(nameof(model.Email),
                    "This e-mail address is already registered.");
                return View(model);                 // redisplay with validation error
            }

            _context.Registers.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Login", "Login");
        }
    }
    public class ProductsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _ctx;

        public ProductsApiController(ApplicationDbContext ctx) => _ctx = ctx;

        // GET /api/products/all
        [HttpGet("all")]
        public IActionResult All()
        {
            var data = _ctx.Products.Select(p => new
            {
                id = p.Id,
                name = p.Name,
                cat = p.Category,
                image = p.ImageUrl,
                price = p.Price
            }).ToList();

            return Ok(data);
        }
    }

    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _ctx;
        public ProductsController(ApplicationDbContext ctx) => _ctx = ctx;

        // /Products/Products
        // /Products/Products?category=Rings
        // /Products/Products?search=owl
        public IActionResult Products(string category, string search)
        {
            var q = _ctx.Products.AsQueryable();

            if (!string.IsNullOrEmpty(category))
                q = q.Where(p => p.Category == category);

            if (!string.IsNullOrEmpty(search))
                q = q.Where(p => p.Name.Contains(search));

            ViewBag.Category = category;
            ViewBag.Search = search;

            return View(q.ToList());
        }

        // GET /Products/Details/5
        public IActionResult Details(int id)
        {
            var p = _ctx.Products.Find(id);
            return p == null ? NotFound() : View(p);
        }
    }

    [Authorize]
    public class CheckoutController : Controller
    {
        private readonly ApplicationDbContext _ctx;
        public CheckoutController(ApplicationDbContext ctx)
        {
            _ctx = ctx;
        }

        // GET /Checkout or /Checkout/Index
        [HttpGet]
        public IActionResult Index()
        {
            // 1) Redirect anonymous users
            if (!User.Identity.IsAuthenticated)
                return RedirectToAction("Login", "Login");

            // 2) Load their cart items (with Product navigation)
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var cartItems = _ctx.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .ToList();

            // 3) Build VM with fresh ShippingInfo & PaymentInfo
            var vm = new CheckoutViewModel
            {
                Shipping = new ShippingInfo(),
                Payment = new PaymentInfo(),
                CartItems = cartItems
            };

            return View(vm);
        }

        // POST /Checkout/PlaceOrder
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult PlaceOrder(CheckoutViewModel vm)
        {
            // 1) Who’s ordering?
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // 2) If validation fails, reload cart and redisplay
            if (!ModelState.IsValid)
            {
                vm.CartItems = _ctx.CartItems
                    .Include(ci => ci.Product)
                    .Where(ci => ci.UserId == userId)
                    .ToList();
                return View("Index", vm);
            }

            // 3) Load the cart one more time (with Product)
            var cartItems = _ctx.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .ToList();

            // 4) Create Order & OrderItems
            var order = new Order
            {
                UserId = userId,
                FirstName = vm.Shipping.FirstName,
                LastName = vm.Shipping.LastName,
                Address1 = vm.Shipping.Address1,
                Address2 = vm.Shipping.Address2,
                City = vm.Shipping.City,
                State = vm.Shipping.State,
                PostalCode = vm.Shipping.PostalCode,
                Country = vm.Shipping.Country,
                CreatedAt = DateTime.UtcNow
            };

            decimal total = 0m;
            foreach (var ci in cartItems)
            {
                var line = new OrderItem
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    UnitPrice = ci.Product.Price
                };
                order.Items.Add(line);
                total += line.UnitPrice * line.Quantity;
            }

            order.Total = total;

            // 5) Persist, then clear cart
            _ctx.Orders.Add(order);
            _ctx.CartItems.RemoveRange(cartItems);
            _ctx.SaveChanges();

            // 6) Redirect to ThankYou
            return RedirectToAction("ThankYou");
        }

        // GET /Checkout/ThankYou
        [HttpGet]
        public IActionResult ThankYou()
        {
            return View();   // make sure Views/Checkout/ThankYou.cshtml exists
        }
    }
    [Authorize]
    public class FavoritesController : Controller
    {
        private readonly ApplicationDbContext _ctx;
        public FavoritesController(ApplicationDbContext ctx) => _ctx = ctx;

        // GET /Favorites
        public IActionResult Index()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            // pull the actual Product for each favorite
            var prods = _ctx.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Product)
                .Select(f => f.Product)
                .ToList();
            return View(prods);
        }

        // POST /Favorites/Add
        [HttpPost, ValidateAntiForgeryToken]
        public IActionResult Add(int productId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (!_ctx.Favorites.Any(f => f.UserId == userId && f.ProductId == productId))
            {
                _ctx.Favorites.Add(new Favorite
                {
                    UserId = userId,
                    ProductId = productId
                });
                _ctx.SaveChanges();
            }
            return RedirectToAction("Products", "Products");
        }

        // POST /Favorites/Remove
        [HttpPost, ValidateAntiForgeryToken]
        public IActionResult Remove(int productId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var fav = _ctx.Favorites.SingleOrDefault(f => f.UserId == userId && f.ProductId == productId);
            if (fav != null)
            {
                _ctx.Favorites.Remove(fav);
                _ctx.SaveChanges();
            }
            return RedirectToAction("Products", "Products");
        }
    }
    [Authorize]                           // only signed-in users may view or modify
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
                    Product = c.Product   // ensure EF Core includes it
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
            var existing = _ctx.CartItems
                .SingleOrDefault(c => c.UserId == userId && c.ProductId == productId);

            if (existing != null)
            {
                existing.Quantity++;
            }
            else
            {
                var product = _ctx.Products.Find(productId)!;
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
            return RedirectToAction(nameof(Index));
        }

        // POST /Cart/UpdateQuantity
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UpdateQuantity(int productId, int quantity)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var item = _ctx.CartItems
                .SingleOrDefault(c => c.UserId == userId && c.ProductId == productId);

            if (item != null)
            {
                if (quantity <= 0)
                {
                    _ctx.CartItems.Remove(item);
                }
                else
                {
                    item.Quantity = quantity;
                }
                _ctx.SaveChanges();
            }

            return RedirectToAction(nameof(Index));
        }

        // POST /Cart/Remove
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Remove(int productId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var item = _ctx.CartItems
                .SingleOrDefault(c => c.UserId == userId && c.ProductId == productId);

            if (item != null)
            {
                _ctx.CartItems.Remove(item);
                _ctx.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}

public class ErrorController : Controller
{
    private readonly ILogger<ErrorController> _logger;

    public ErrorController(ILogger<ErrorController> logger)
    {
        _logger = logger;
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}       