using System;

namespace noties.Models
{
	public class Materias
	{
		public int Id { get; set; }
		public string Nombre { get; set; }
		public string Profesor { get; set; }

		public Materias() { }

		public Materias(int id, string nombre, string profesor)
		{
			Id = id;
			Nombre = nombre;
			Profesor = profesor;
		}
	}
}
