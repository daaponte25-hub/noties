using System;

namespace noties.Models
{
    public class Actividad
    {
        public int Id { get; set; }

        public int MateriaId { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public double Porcentaje { get; set; }

        public double? Nota { get; set; }

        public DateTime? FechaEntrega { get; set; }

        public string CreadoPor { get; set; } = string.Empty;
    }
}