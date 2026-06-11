using NotiesBlazor.Models;

namespace NotiesBlazor.Services
{
    /// <summary>
    /// Clase base abstracta que define el contrato para los comportamientos de cada rol (Abstracción).
    /// </summary>
    public abstract class DescriptorRol
    {
        public abstract string ObtenerMenuPrincipal();
        public abstract string ObtenerDashboardInfo();
    }

    /// <summary>
    /// Comportamiento específico para el Administrador (Polimorfismo).
    /// </summary>
    public class AdministradorDescriptor : DescriptorRol
    {
        public override string ObtenerMenuPrincipal() => "/usuarios";
        public override string ObtenerDashboardInfo() => "Panel de Control Global: Gestión de Base de Datos y Usuarios.";
    }

    /// <summary>
    /// Comportamiento específico para el Docente (Polimorfismo).
    /// </summary>
    public class DocenteDescriptor : DescriptorRol
    {
        public override string ObtenerMenuPrincipal() => "/materias";
        public override string ObtenerDashboardInfo() => "Panel del Docente: Gestión de Notas, Evaluaciones y Asistencias.";
    }

    /// <summary>
    /// Comportamiento específico para el Representante (Polimorfismo).
    /// </summary>
    public class RepresentanteDescriptor : DescriptorRol
    {
        public override string ObtenerMenuPrincipal() => "/materias";
        public override string ObtenerDashboardInfo() => "Panel del Representante: Consulta de Rendimiento Académico.";
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