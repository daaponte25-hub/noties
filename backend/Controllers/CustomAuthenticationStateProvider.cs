using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;
using NotiesBlazor.Models;

namespace NotiesBlazor.Controllers
{
    public class CustomAuthenticationStateProvider : AuthenticationStateProvider
    {
        private readonly UserController _userController;

        public CustomAuthenticationStateProvider(UserController userController)
        {
            _userController = userController;
        }

        public override Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            var user = _userController.SessionUser;

            if (user == null)
            {
                var anonymous = new ClaimsPrincipal(new ClaimsIdentity());
                return Task.FromResult(new AuthenticationState(anonymous));
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role.ToString()) // Aquí inyectamos Admin, Docente, etc.
            };

            var identity = new ClaimsIdentity(claims, "CustomAuth");
            var principal = new ClaimsPrincipal(identity);

            return Task.FromResult(new AuthenticationState(principal));
        }

        public void NotificarCambioAutenticacion()
        {
            NotifyAuthenticationStateChanged(GetAuthenticationStateAsync());
        }
    }
}