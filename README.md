# 🏋️‍♂️ MC Gym – Frontend

## 📌 Descripción
MC Gym es un software de gestión para gimnasios que permite administrar **alumnos, profesores, pagos y rutinas**, manteniendo una experiencia clara y familiar para usuarios acostumbrados a sistemas como AccessGym.

Este repositorio contiene el **frontend** de la aplicación: la interfaz visual que utilizan administradores, profesores y alumnos.

---

## 🎯 Objetivos
- Interfaz simple y rápida
- Diseño familiar (similar a AccessGym)
- Separación clara por roles
- Uso cómodo en desktop y mobile
- Código escalable y mantenible

---

## 👥 Roles del sistema
### 🛠️ Administrador
- Gestión de alumnos
- Control de pagos
- Alta y baja de profesores
- Vista general del estado del gimnasio

### 🧑‍🎓 Alumno
- Visualización de estado de cuota
- Acceso a rutinas
- Perfil personal
- Avisos del gimnasio

### 🧑‍🏫 Profesor
- Ver alumnos asignados
- Cargar y editar rutinas
- Seguimiento básico

---

## 🧱 Tecnologías utilizadas
- ⚛️ React (Vite)
- 🎨 CSS / CSS Modules
- 🔁 Axios
- 🔐 JWT
- 🌐 React Router
- 🧠 Context API

---

## 🗂️ Estructura del proyecto
- `src/pages` → Vistas principales
- `src/components` → Componentes reutilizables
- `src/services` → Conexión con API
- `src/contexts` → Estado global (auth / usuario)
- `src/assets` → Recursos visuales

---

## 🔐 Autenticación
- Login con usuario y contraseña
- Manejo de sesión con JWT
- Rutas protegidas según rol
- Logout seguro

---

## 🔄 Comunicación con backend
El frontend consume una API REST desarrollada en Node.js para:
- Autenticación
- Gestión de alumnos
- Pagos
- Rutinas
- Usuarios

---

## 🚀 Estado del proyecto
🟡 En desarrollo  
Base funcional completa y lista para ampliaciones.

---


    },
  },
])
```
