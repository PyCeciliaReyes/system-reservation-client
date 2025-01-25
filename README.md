### Sistema de reserva cliente

Este proyecto es el frontend del Sistema de Reservas, desarrollado con React y Tailwind CSS, conectado a un backend mediante fetch para realizar operaciones CRUD sobre Personas, Habitaciones, y Reservas.

El sistema está diseñado para gestionar reservas de habitaciones con datos de personas, validaciones dinamicas y manejo de errores.

---

🎯 Características

    Personas:
        Crear, listar, editar y eliminar personas.
        Manejo de errores como correos o números de documento duplicados.

    Habitaciones:
        Crear, listar, editar y eliminar habitaciones.
        Validación de los atributos como cantidad de camas, disponibilidad, etc.

    Reservas:
        Crear, listar, editar y eliminar reservas.
        Validación de fechas (entrada y salida).
        Cálculo automático del monto de la reserva según las fechas seleccionadas.

---

🚀 Enlace a Produccion

La aplicacion esta desplegada en Netlify y accesible en el siguiente enlace:
👉 **[Sistema de Reserva](https://systema-reservation.netlify.app/persona)**

---

🛠️ Tecnologias Utilizadas

- React: Libreria para construir la interfaz de usuario.
- Tailwind CSS: Framework para el diseño rápido y responsivo.
- Vite: Herramienta para construir el proyecto.
- Fetch API: Conexion al backend para realizar las operaciones CRUD.
- Netlify: Plataforma para el despliegue.

---

📂 Estructura del Proyecto

```
src/
├── componente/
│   ├── habitacion/   # Modulo para gestionar Personas
|   |   ├── habitacion.jsx
│   ├── persona/ # Modulo para gestionar Habitaciones
|   |   ├── persona.jsx
│   ├── reserva/   # Modulo para gestionar Reservas
|   |   ├── reserva.jsx
├── utils/
│   ├── api.js        # Configuracion de API y autenticacion
├── App.jsx           # Enrutador principal
├── main.jsx          # Entrada principal
├── index.css         # Estilos base con Tailwind
```

---

🔐 Conexión al Backend

El proyecto utiliza Basic Authentication para conectarse al backend. Las credenciales de acceso estan configuradas en un archivo .env, y esta informacion pueden tener en el .env.template

Asegurarse de configurar estas variables antes de iniciar el proyecto.

---

📋 Notas
- Asegurarse de que el backend esté funcionando correctamente para las operaciones CRUD.
- La aplicación está configurada para trabajar en entornos de desarrollo y producción.