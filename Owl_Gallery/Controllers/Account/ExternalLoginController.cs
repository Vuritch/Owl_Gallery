using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Owl_Gallery.Data;
using Owl_Gallery.Models;
using System.Security.Claims;

namespace Owl_Gallery.Controllers.Account
{
    [AllowAnonymous]
    public class ExternalLoginController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ExternalLoginController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GoogleLogin()
        {
            var authenticationProperties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse")
            };
            return Challenge(authenticationProperties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet]
        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
                return RedirectToAction("Login", "Login");

            var claims = authenticateResult.Principal.Identities
                .FirstOrDefault()?.Claims
                .Select(claim => new
                {
                    claim.Type,
                    claim.Value
                });

            string email = claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            string fullName = claims?.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email))
                return RedirectToAction("Login", "Login");

            // Check if user already exists in your DB
            var user = _context.Registers.FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                // Create a new local user
                user = new Register
                {
                    FirstName = fullName?.Split(' ').FirstOrDefault() ?? "Google",
                    LastName = fullName?.Split(' ').Skip(1).FirstOrDefault() ?? "User",
                    Email = email,
                    Password = "" // No password needed for external login
                };

                _context.Registers.Add(user);
                await _context.SaveChangesAsync();
            }

            // Now sign them in
            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var identity = new ClaimsIdentity(userClaims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return RedirectToAction("Index", "Index");
        }
    }
}
