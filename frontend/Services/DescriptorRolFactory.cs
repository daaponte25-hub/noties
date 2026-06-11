using NotiesBlazor.Models;

namespace NotiesBlazor.Services
{
    public abstract class DescriptorRol
    {
        public abstract string ObtenerMenuPrincipal();
        public abstract string ObtenerDashboardInfo();
    }

    public class AdministradorDescriptor : DescriptorRol
    {
        public override string ObtenerMenuPrincipal() => "/usuarios";
        public override string ObtenerDashboardInfo() => "Panel de Control Global: Gestión de Base de Datos y Usuarios.";
    }

    public class DocenteDescriptor : DescriptorRol
    {
        public override string ObtenerMenuPrincipal() => "/materias";
        public override string ObtenerDashboardInfo() => "Panel del Docente: Gestión de Notas, Evaluaciones y Asistencias.";
    }

    public class RepresentanteDescriptor : DescriptorRol
    {
        public override string ObtenerMenuPrincipal() => "/materias";
        public override string ObtenerDashboardInfo() => "Panel del Representante: Consulta de Rendimiento Académico.";
    }

    public static class DescriptorRolFactory
    {
        public static DescriptorRol Crear(UserRole role)
        {
            return role switch
            {
                UserRole.Administrador => new AdministradorDescriptor(),
                UserRole.Docente => new DocenteDescriptor(),
                UserRole.Representante => new RepresentanteDescriptor(),
                _ => throw new ArgumentOutOfRangeException(nameof(role), $"El rol {role} no está soportado.")
            };
        }
    }
}
