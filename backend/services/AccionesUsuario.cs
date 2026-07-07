using NotiesBlazor.Models;

namespace NotiesBlazor.Services
{
    /// <summary>
    /// </summary>
    public abstract class DescriptorRol
    {
        public abstract string ObtenerMenuPrincipal();
        public abstract string ObtenerDashboardInfo();
    }

    /// <summary>
    /// </summary>
    public class AdministradorDescriptor : DescriptorRol
    {
        public override string ObtenerMenuPrincipal() { return "/usuarios"; }
        public override string ObtenerDashboardInfo() { return "Panel de Control Global: Gestión de Base de Datos y Usuarios."; }
    }

    /// <summary>
    /// </summary>
    public class DocenteDescriptor : DescriptorRol
    {
        public override string ObtenerMenuPrincipal() { return "/materias"; }
        public override string ObtenerDashboardInfo() { return "Panel del Docente: Gestión de Notas, Evaluaciones y Asistencias."; }
    }

    /// <summary>
    /// </summary>
    public class RepresentanteDescriptor : DescriptorRol
    {
        public override string ObtenerMenuPrincipal() { return "/materias"; }
        public override string ObtenerDashboardInfo() { return "Panel del Representante: Consulta de Rendimiento Académico."; }
    }

    /// <summary>
    /// </summary>
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