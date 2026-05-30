using System;

namespace noties.Models
{
    public class Actividad
    {
        // Propiedades
        public int Id { get; set; }
        public int MateriaId { get; set; } // Llave foránea (Relación con Materia)
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public double Porcentaje { get; set; }
        public double? Nota { get; set; } // Nullable (puede ser nulo si no se ha calificado)
        public string CreadoPor { get; set; } = string.Empty; // "Profesor" o "Administrador"
        public DateTime FechaEntrega { get; set; }

        // Constructor vacío (Obligatorio para la deserialización de JSON)
        public Actividad() { }

        // Constructor con parámetros para instanciar fácilmente el objeto
        public Actividad(int id, int materiaId, string nombre, string descripcion, double porcentaje, double? nota, string creadoPor, DateTime fechaEntrega)
        {
            Id = id;
            MateriaId = materiaId;
            Nombre = nombre;
            Descripcion = descripcion;
            Porcentaje = porcentaje;
            Nota = nota;
            CreadoPor = creadoPor;
            FechaEntrega = fechaEntrega;
        }
    }
}