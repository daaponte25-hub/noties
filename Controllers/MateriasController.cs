using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace NotiesBlazor.Controllers
{
	public class MateriasController
	{
		private readonly string _filePath;
		private static readonly object _lock = new();

		public MateriasController(Microsoft.AspNetCore.Hosting.IWebHostEnvironment? env = null)
		{
			string rootDir = env?.ContentRootPath ?? Directory.GetCurrentDirectory();
			_filePath = Path.Combine(rootDir, "data", "Materias.json");

			string? dir = Path.GetDirectoryName(_filePath);
			if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
			{
				Directory.CreateDirectory(dir);
			}

			if (!File.Exists(_filePath))
			{
				File.WriteAllText(_filePath, "[]");
			}
		}

		public class Materia
		{
			public int Id { get; set; }
			public string Nombre { get; set; } = string.Empty;
			public string Profesor { get; set; } = string.Empty;
		}

		public async Task<List<Materia>> GetMateriasAsync()
		{
			try
			{
				if (!File.Exists(_filePath)) return new List<Materia>();

				string jsonContent = await File.ReadAllTextAsync(_filePath);
				if (string.IsNullOrWhiteSpace(jsonContent)) return new List<Materia>();

				var options = new JsonSerializerOptions
				{
					PropertyNameCaseInsensitive = true
				};

				return JsonSerializer.Deserialize<List<Materia>>(jsonContent, options) ?? new List<Materia>();
			}
			catch (Exception ex)
			{
				throw new Exception($"Error leyendo base de datos de materias ({_filePath}): {ex.Message}", ex);
			}
		}

		private async Task SaveMateriasAsync(List<Materia> materias)
		{
			try
			{
				var options = new JsonSerializerOptions
				{
					WriteIndented = true
				};

				string jsonContent = JsonSerializer.Serialize(materias, options);

				lock (_lock)
				{
					File.WriteAllText(_filePath, jsonContent);
				}

				await Task.CompletedTask;
			}
			catch (Exception ex)
			{
				throw new Exception($"No se pudo persistir los datos en el archivo plano de materias: {ex.Message}");
			}
		}

		public async Task<Materia?> GetMateriaByIdAsync(int id)
		{
			var materias = await GetMateriasAsync();
			return materias.FirstOrDefault(m => m.Id == id);
		}

		public async Task<Materia> CreateMateriaAsync(Materia newMateria)
		{
			if (string.IsNullOrWhiteSpace(newMateria.Nombre) || string.IsNullOrWhiteSpace(newMateria.Profesor))
			{
				throw new Exception("El nombre de la materia y el profesor son requeridos.");
			}

			var materias = await GetMateriasAsync();

			if (materias.Any(m => m.Nombre.Equals(newMateria.Nombre, StringComparison.OrdinalIgnoreCase)))
			{
				throw new Exception("Ya existe una materia registrada con ese nombre.");
			}

			newMateria.Id = materias.Count == 0 ? 1 : materias.Max(m => m.Id) + 1;
			newMateria.Nombre = newMateria.Nombre.Trim();
			newMateria.Profesor = newMateria.Profesor.Trim();

			materias.Add(newMateria);
			await SaveMateriasAsync(materias);

			return newMateria;
		}

		public async Task<Materia> UpdateMateriaAsync(int id, Materia updateDetails)
		{
			var materias = await GetMateriasAsync();
			var targetMateria = materias.FirstOrDefault(m => m.Id == id);

			if (targetMateria == null)
			{
				throw new Exception("Materia no encontrada.");
			}

			if (!targetMateria.Nombre.Equals(updateDetails.Nombre, StringComparison.OrdinalIgnoreCase))
			{
				if (materias.Any(m => m.Id != id && m.Nombre.Equals(updateDetails.Nombre, StringComparison.OrdinalIgnoreCase)))
				{
					throw new Exception("Ya existe otra materia con ese nombre.");
				}
			}

			targetMateria.Nombre = updateDetails.Nombre.Trim();
			targetMateria.Profesor = updateDetails.Profesor.Trim();

			await SaveMateriasAsync(materias);
			return targetMateria;
		}

		public async Task DeleteMateriaAsync(int id)
		{
			var materias = await GetMateriasAsync();
			var targetMateria = materias.FirstOrDefault(m => m.Id == id);

			if (targetMateria == null)
			{
				throw new Exception("La materia no se encuentra registrada en el sistema.");
			}

			materias.Remove(targetMateria);
			await SaveMateriasAsync(materias);
		}
	}
}
