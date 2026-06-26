using System.Collections.Generic;

namespace noties.Models
{
    public class Estudiante
    {
        public string Id { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string RepresentanteId { get; set; } = string.Empty;

        public List<int> MateriaIds { get; set; } = new();

        public string Curso { get; set; } = string.Empty;

        public string CreatedAt { get; set; } = string.Empty;
    }
}
