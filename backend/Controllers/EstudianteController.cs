using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using noties.Models;

namespace NotiesBlazor.Controllers
{
    public class EstudianteController: ControllerBase
    {
        private readonly string _filePath;
        private static readonly object _lock = new();

        public EstudianteController(Microsoft.AspNetCore.Hosting.IWebHostEnvironment? env = null)
        {
            string rootDir = env?.ContentRootPath ?? Directory.GetCurrentDirectory();
            _filePath = Path.Combine(rootDir, @"backend\\data", "Estudiantes.json");

            string? dir = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            if (!System.IO.File.Exists(_filePath))
            {
                System.IO.File.WriteAllText(_filePath, "[]");
            }
        }

        public async Task<List<Estudiante>> GetEstudiantesAsync()
        {
            try
            {
                if (!System.IO.File.Exists(_filePath)) return new List<Estudiante>();

                string jsonContent = await System.IO.File.ReadAllTextAsync(_filePath);
                if (string.IsNullOrWhiteSpace(jsonContent)) return new List<Estudiante>();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                return JsonSerializer.Deserialize<List<Estudiante>>(jsonContent, options) ?? new List<Estudiante>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error leyendo base de datos de estudiantes: {ex.Message}", ex);
            }
        }

        public async Task<Estudiante?> GetEstudianteByIdAsync(string id)
        {
            var estudiantes = await GetEstudiantesAsync();
            return estudiantes.FirstOrDefault(e => e.Id == id);
        }

        public async Task<Estudiante> CreateEstudianteAsync(Estudiante nuevo)
        {
            if (string.IsNullOrWhiteSpace(nuevo.FullName))
            {
                throw new Exception("El nombre del estudiante es obligatorio.");
            }

            var estudiantes = await GetEstudiantesAsync();

            nuevo.Id = string.IsNullOrEmpty(nuevo.Id) ? $"est-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}" : nuevo.Id;
            nuevo.FullName = nuevo.FullName.Trim();
            nuevo.CreatedAt = DateTime.UtcNow.ToString("o");

            estudiantes.Add(nuevo);

            await SaveEstudiantesAsync(estudiantes);

            return nuevo;
        }

        private async Task SaveEstudiantesAsync(List<Estudiante> estudiantes)
        {
            try
            {
                var options = new JsonSerializerOptions { WriteIndented = true };
                string jsonContent = JsonSerializer.Serialize(estudiantes, options);

                lock (_lock)
                {
                    System.IO.File.WriteAllText(_filePath, jsonContent);
                }

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw new Exception($"No se pudo persistir los estudiantes: {ex.Message}");
            }
        }
    }
}
