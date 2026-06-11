using System;
using System.Collections.Generic;
using System.Linq;

namespace noties.Models
{
    public class Actividad
    {
        public int Id { get; set; }
        public int MateriaId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public double Porcentaje { get; set; }
        public DateTime? FechaEntrega { get; set; }
        public string CreadoPor { get; set; } = string.Empty;

        public string NotasPorAlumno { get; set; } = string.Empty;

        public double ObtenerNotaEstudiante(string estudianteId)
        {
            if (string.IsNullOrWhiteSpace(NotasPorAlumno)) return 0; // Por defecto es 0

            var registros = NotasPorAlumno.Split(',');
            foreach (var reg in registros)
            {
                var partes = reg.Split(':');
                if (partes.Length == 2 && partes[0] == estudianteId)
                {
                    if (double.TryParse(partes[1], out double nota))
                    {
                        return nota;
                    }
                }
            }
            return 0;
        }
    }
}