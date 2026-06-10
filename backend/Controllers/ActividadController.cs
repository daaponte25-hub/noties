using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using noties.Models; 

namespace NotiesBlazor.Controllers
{
    public class ActividadController
    {
        private readonly string _filePath;
        private static readonly object _lock = new();
        private readonly MateriasController _materiasController;

        public ActividadController(Microsoft.AspNetCore.Hosting.IWebHostEnvironment? env = null)
        {
            string rootDir = env?.ContentRootPath ?? Directory.GetCurrentDirectory();
            _filePath = Path.Combine(rootDir, "data", "Actividades.json");

            string? dir = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            if (!File.Exists(_filePath))
            {
                File.WriteAllText(_filePath, "[]");
            }

            _materiasController = new MateriasController(env);
        }

        public async Task<List<Actividad>> GetActividadesAsync()
        {
            try
            {
                if (!File.Exists(_filePath)) return new List<Actividad>();

                string jsonContent = await File.ReadAllTextAsync(_filePath);
                if (string.IsNullOrWhiteSpace(jsonContent)) return new List<Actividad>();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                
                return JsonSerializer.Deserialize<List<Actividad>>(jsonContent, options) ?? new List<Actividad>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error leyendo base de datos de actividades: {ex.Message}", ex);
            }
        }


        public async Task<Actividad?> GetActividadByIdAsync(int id)
        {
            var actividades = await GetActividadesAsync();
            return actividades.FirstOrDefault(a => a.Id == id);
        }

        public async Task<List<Actividad>> GetActividadesByMateriaAsync(int materiaId)
        {
            var actividades = await GetActividadesAsync();
            return actividades.Where(a => a.MateriaId == materiaId).ToList();
        }

        public async Task<Actividad> CreateActividadAsync(Actividad newActividad)
        {
            if (string.IsNullOrWhiteSpace(newActividad.Nombre) || string.IsNullOrWhiteSpace(newActividad.CreadoPor))
            {
                throw new Exception("El nombre de la actividad y el rol creador son requeridos.");
            }

            var materia = await _materiasController.GetMateriaByIdAsync(newActividad.MateriaId);
            if (materia == null)
            {
                throw new Exception("La materia especificada no existe.");
            }

            if (newActividad.Porcentaje <= 0 || newActividad.Porcentaje > 100)
            {
                throw new Exception("El porcentaje de evaluación debe estar entre 1% y 100%.");
            }

            var actividades = await GetActividadesAsync();
            var actividadesMateria = actividades.Where(a => a.MateriaId == newActividad.MateriaId).ToList();

            double porcentajeActual = actividadesMateria.Sum(a => a.Porcentaje);
            if (porcentajeActual + newActividad.Porcentaje > 100)
            {
                throw new Exception($"No se puede agregar. El porcentaje total acumulado de esta materia superaría el 100% (Actual: {porcentajeActual}%).");
            }

            if (actividadesMateria.Any(a => a.Nombre.Equals(newActividad.Nombre, StringComparison.OrdinalIgnoreCase)))
            {
                throw new Exception("Ya existe una actividad con ese nombre en esta materia.");
            }

            newActividad.Id = actividades.Count == 0 ? 1 : actividades.Max(a => a.Id) + 1;
            newActividad.Nombre = newActividad.Nombre.Trim();
            newActividad.Descripcion = newActividad.Descripcion?.Trim() ?? "";
            newActividad.CreadoPor = newActividad.CreadoPor.Trim();

            actividades.Add(newActividad);
            await SaveActividadesAsync(actividades);

            return newActividad;
        }

        public async Task<Actividad> UpdateActividadAsync(int id, Actividad updateDetails)
        {
            var actividades = await GetActividadesAsync();
            var targetActividad = actividades.FirstOrDefault(a => a.Id == id);

            if (targetActividad == null)
            {
                throw new Exception("Actividad no encontrada.");
            }

            if (updateDetails.Porcentaje <= 0 || updateDetails.Porcentaje > 100)
            {
                throw new Exception("El porcentaje de evaluación debe estar entre 1% y 100%.");
            }

            double porcentajeRestante = actividades
                .Where(a => a.MateriaId == targetActividad.MateriaId && a.Id != id)
                .Sum(a => a.Porcentaje);

            if (porcentajeRestante + updateDetails.Porcentaje > 100)
            {
                throw new Exception($"El porcentaje acumulado superaría el 100% (Permitido restante: {100 - porcentajeRestante}%).");
            }

            if (updateDetails.Nota.HasValue && (updateDetails.Nota.Value < 0 || updateDetails.Nota.Value > 20))
            {
                throw new Exception("La nota debe estar en el rango de 0 a 20.");
            }

            targetActividad.Nombre = updateDetails.Nombre.Trim();
            targetActividad.Descripcion = updateDetails.Descripcion?.Trim() ?? "";
            targetActividad.Porcentaje = updateDetails.Porcentaje;
            targetActividad.Nota = updateDetails.Nota; 
            targetActividad.FechaEntrega = updateDetails.FechaEntrega;

            await SaveActividadesAsync(actividades);
            return targetActividad;
        }

        public async Task DeleteActividadAsync(int id)
        {
            var actividades = await GetActividadesAsync();
            var targetActividad = actividades.FirstOrDefault(a => a.Id == id);

            if (targetActividad == null)
            {
                throw new Exception("La actividad no existe.");
            }

            actividades.Remove(targetActividad);
            await SaveActividadesAsync(actividades);
        }

        

        private async Task SaveActividadesAsync(List<Actividad> actividades)
        {
            lock (_lock)
            {
                var options = new JsonSerializerOptions { WriteIndented = true };
                string jsonString = JsonSerializer.Serialize(actividades, options);
                File.WriteAllText(_filePath, jsonString);
            }
            await Task.CompletedTask;
        }
    }
}