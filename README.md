# Noties: Sistema de Gestión e Información Escolar

## Introducción
Noties es la plataforma digital diseñada para la comunidad del subsistema de educación básica (inicial y primaria), que tiene como misión principal ofrecer un espacio seguro y confiable donde se optimice la comunicación, el control de registros académicos y la consulta inmediata de calificaciones por parte de los representantes legales, administradores y docentes.

## Funcionalidades Clave
La plataforma está pensada para ser intuitiva y funcional para sus distintos roles de acceso:
* **Gestión de Usuarios:** Permite al rol Administrador dar de alta, consultar, actualizar y revocar los accesos de todo el personal que interactúa con el sistema.
* **Gestión de Materias:** Automatiza la configuración de la oferta académica, adaptándose rápidamente a cambios en la plantilla docente y normativas del plantel.
* **Gestión de Actividades y Evaluación:** Espacio dedicado para que los docentes planifiquen las evaluaciones del lapso, ponderen las entregas y registren las calificaciones. Los representantes cuentan con acceso exclusivo de consulta.
* **Gestión de Estudiantes:** Permite la matriculación de alumnos y la vinculación directa y obligatoria con su respectivo representante legal para asegurar la confidencialidad de la información.

## Tecnologías Empleadas
Noties es una aplicación web que sigue una arquitectura Cliente-Servidor (Frontend/Backend). Las siguientes tecnologías conforman las herramientas de desarrollo:

### Frontend
* **Blazor Web / Razor (ASP.NET Core):** Interfaz de usuario interactiva y moderna construida mediante componentes reactivos en C#, optimizada para entornos de escritorio.

### Backend y Servidor
* **ASP.NET Core:** Framework basado en C#, utilizado para construir la lógica de negocio, los controladores, modelos y las APIs del lado del servidor.

### Gestión y Persistencia
* **Git:** Sistema de control de versiones, esencial para la colaboración en equipo y el manejo de código. El alojamiento y flujo de trabajo se gestiona a través de GitHub.
* **JSON (JavaScript Object Notation):** Se empleará como formato de intercambio de datos para la comunicación Cliente-Servidor (a través de APIs REST). JSON también se utiliza para el almacenamiento en local de los datos.

## Arquitectura del Proyecto
El sistema está estructurado bajo un enfoque Cliente-Servidor, dividiendo claramente la lógica de negocio (backend) de la interfaz de usuario (frontend). Esta separación permite un desarrollo modular, escalable y mantenible, facilitando la colaboración entre equipos y la evolución del sistema.

Ambos componentes se comunican a través de peticiones HTTP utilizando JSON como formato de intercambio de datos, siguiendo el estilo de arquitectura RESTful.

### Estructura General
```text
project/
├── Noties/          # Capa Backend: Lógica del servidor, controladores, modelos, servicios, repositorios
└── NotiesBlazor/    # Capa Frontend: Interfaz de usuario, componentes Blazor, páginas y recursos estáticos

### Equipo de Desarrollo:

Daniela Aponte

Roger Aparicio

Roger Salgado

Carlos Carrero.

**Prerequisites:**  Node.js, .NET CORE 8.0 SDK (v8.0.421) 
