using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using NotiesBlazor.Models;

namespace NotiesBlazor.Controllers
{
    public class UserController
    {
        private readonly string _filePath;
        private static readonly object _lock = new();

        public User? SessionUser { get; set; }

        public UserController(Microsoft.AspNetCore.Hosting.IWebHostEnvironment? env = null)
        {
            // Resolve path to flat file "data/users.json" using WebHostEnvironment if available, otherwise fallback
            string rootDir = env?.ContentRootPath ?? Directory.GetCurrentDirectory();
            _filePath = Path.Combine(rootDir, "data", "users.json");

            // Safeguard directory existence
            string? dir = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            // Create and seed file with default administrative and teaching staff if empty or not present
            bool shouldSeed = false;
            if (!File.Exists(_filePath))
            {
                shouldSeed = true;
            }
            else
            {
                try
                {
                    string content = File.ReadAllText(_filePath);
                    if (string.IsNullOrWhiteSpace(content) || content.Trim() == "[]")
                    {
                        shouldSeed = true;
                    }
                }
                catch
                {
                    shouldSeed = true;
                }
            }

            if (shouldSeed)
            {
                var defaultUsers = new List<User>
                {
                    new User
                    {
                        Id = "admin-default-id",
                        FullName = "Administrador de Noties",
                        Email = "admin@noties.com",
                        Password = "admin",
                        Role = UserRole.Administrador,
                        Status = UserStatus.Activo,
                        CreatedAt = "2026-05-26T15:47:05.133Z"
                    },
                    new User
                    {
                        Id = "teacher-1",
                        FullName = "Sonia Rodríguez",
                        Email = "sonia.rodriguez@noties.edu",
                        Password = "sonia",
                        Role = UserRole.Docente,
                        Status = UserStatus.Activo,
                        CreatedAt = "2026-05-26T15:47:05.133Z"
                    },
                    new User
                    {
                        Id = "coord-1",
                        FullName = "Carlos Gómez",
                        Email = "carlos.gomez@noties.edu",
                        Password = "carlos",
                        Role = UserRole.Representante,
                        Status = UserStatus.Activo,
                        CreatedAt = "2026-05-26T15:47:05.133Z"
                    },
                    new User
                    {
                        Id = "student-1",
                        FullName = "Mateo Fernández",
                        Email = "mateo.fernandez@noties.edu",
                        Password = "student",
                        Role = UserRole.Representante,
                        Status = UserStatus.Inactivo,
                        CreatedAt = "2026-05-26T15:47:05.133Z"
                    },
                    new User
                    {
                        Id = "user-1779811387152-r28cukh6z",
                        FullName = "Roger Aparicio",
                        Email = "rsaparicio.21@est.ucab.edu.ve",
                        Password = "1234..",
                        Role = UserRole.Administrador,
                        Status = UserStatus.Activo,
                        CreatedAt = "2026-05-26T16:03:07.152Z"
                    }
                };
                var options = new JsonSerializerOptions { WriteIndented = true };
                string seedJson = JsonSerializer.Serialize(defaultUsers, options);
                File.WriteAllText(_filePath, seedJson);
            }
        }

        /// <summary>
        /// Reads all users from the JSON flat file.
        /// </summary>
        public async Task<List<User>> GetUsersAsync()
        {
            try
            {
                if (!File.Exists(_filePath)) return new List<User>();

                string jsonContent = await File.ReadAllTextAsync(_filePath);
                if (string.IsNullOrWhiteSpace(jsonContent)) return new List<User>();

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                return JsonSerializer.Deserialize<List<User>>(jsonContent, options) ?? new List<User>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error leyendo base de datos de usuarios ({_filePath}): {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Saves the state list of users back to the JSON flat file.
        /// </summary>
        private async Task SaveUsersAsync(List<User> users)
        {
            try
            {
                var options = new JsonSerializerOptions
                {
                    WriteIndented = true
                };
                string jsonContent = JsonSerializer.Serialize(users, options);
                
                // Write with thread-safety locks
                lock (_lock)
                {
                    File.WriteAllText(_filePath, jsonContent);
                }
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw new Exception($"No se pudo persistir los datos en el archivo plano: {ex.Message}");
            }
        }

        /// <summary>
        /// Procesa la autenticación del usuario mediante correo y contraseña.
        /// </summary>
        public async Task<AuthResponse> LoginAsync(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return new AuthResponse { Success = false, Message = "Por favor complete todos los campos." };
            }

            var users = await GetUsersAsync();
            var matchedUser = users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

            if (matchedUser == null)
            {
                return new AuthResponse { Success = false, Message = "Credenciales incorrectas. Verifique el correo electrónico." };
            }

            if (matchedUser.Password != password)
            {
                return new AuthResponse { Success = false, Message = "Contraseña incorrecta. Inténtelo de nuevo." };
            }

            if (matchedUser.Status == UserStatus.Inactivo)
            {
                return new AuthResponse { Success = false, Message = "Su usuario se encuentra inactivo. Comuníquese con la dirección escolar." };
            }

            return new AuthResponse
            {
                Success = true,
                Message = "Acceso concedido exitosamente.",
                User = matchedUser
            };
        }

        /// <summary>
        /// Recupera un único usuario identificado por su clave ID.
        /// </summary>
        public async Task<User?> GetUserByIdAsync(string id)
        {
            var users = await GetUsersAsync();
            return users.FirstOrDefault(u => u.Id == id);
        }

        /// <summary>
        /// Registra un nuevo usuario en la base de datos central.
        /// </summary>
        public async Task<User> CreateUserAsync(User newUser)
        {
            if (string.IsNullOrWhiteSpace(newUser.FullName) || string.IsNullOrWhiteSpace(newUser.Email))
            {
                throw new Exception("El nombre completo y correo electrónico son requeridos.");
            }

            var users = await GetUsersAsync();

            // Check duplicate email
            if (users.Any(u => u.Email.Equals(newUser.Email, StringComparison.OrdinalIgnoreCase)))
            {
                throw new Exception("El correo electrónico ya se encuentra registrado por otro miembro escolar.");
            }

            // Assign ID and creation metadata
            newUser.Id = "user-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() + "-" + Guid.NewGuid().ToString("n")[..8];
            newUser.CreatedAt = DateTime.UtcNow.ToString("o"); // ISO 8601 string format

            users.Add(newUser);
            await SaveUsersAsync(users);

            return newUser;
        }

        /// <summary>
        /// Actualiza la información de un usuario existente.
        /// </summary>
        public async Task<User> UpdateUserAsync(string id, User updateDetails)
        {
            var users = await GetUsersAsync();
            var targetUser = users.FirstOrDefault(u => u.Id == id);
            if (targetUser == null)
            {
                throw new Exception("Usuario no encontrado.");
            }

            // Check duplicate email (if email is changing)
            if (!targetUser.Email.Equals(updateDetails.Email, StringComparison.OrdinalIgnoreCase))
            {
                if (users.Any(u => u.Id != id && u.Email.Equals(updateDetails.Email, StringComparison.OrdinalIgnoreCase)))
                {
                    throw new Exception("El nuevo correo ya se encuentra en uso por otro miembro.");
                }
            }

            // Patch modified fields
            targetUser.FullName = updateDetails.FullName.Trim();
            targetUser.Email = updateDetails.Email.Trim().ToLower();
            targetUser.Role = updateDetails.Role;
            targetUser.Status = updateDetails.Status;

            if (!string.IsNullOrWhiteSpace(updateDetails.Password))
            {
                targetUser.Password = updateDetails.Password;
            }

            await SaveUsersAsync(users);
            return targetUser;
        }

        /// <summary>
        /// Elimina un usuario de la coleccion JSON.
        /// </summary>
        public async Task DeleteUserAsync(string id)
        {
            var users = await GetUsersAsync();
            var targetUser = users.FirstOrDefault(u => u.Id == id);
            if (targetUser == null)
            {
                throw new Exception("El usuario no se encuentra asignado en el sistema.");
            }

            users.Remove(targetUser);
            await SaveUsersAsync(users);
        }
    }
}
