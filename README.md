# Práctica 02.2 - Desarrollo de un CRUD de Productos con Angular y Firebase

**Estudiante:** Edison Michael Muy Angamarca  
**Carrera:** Ingeniería en Ciencias de la Computación  
**Asignatura:** Programación y Plataformas Web  
**Universidad Politécnica Salesiana**  

---

##  Propósito de la Aplicación
Esta aplicación web tiene como propósito administrar un inventario de productos en tiempo real, integrando el framework **Angular v19** (componentes Standalone) con la base de datos NoSQL **Cloud Firestore** de Firebase. La plataforma implementa una arquitectura limpia que separa la lógica de acceso a datos mediante el servicio centralizado `ProductoService`.

* **URL Pública de Vercel:** https://practicafirebase.vercel.app
* **Repositorio en GitHub:** https://github.com/michael200505/Practica_firebase

---

## ⚙️ Funciones del CRUD
La aplicación implementa las cuatro operaciones esenciales sobre la colección `productos` de Firestore:

1. **Crear (Create):** Formulario para registrar nuevos productos con validación estricta de inputs (impide guardar datos vacíos, precios negativos o stocks decimales).
2. **Consultar (Read):** Recupera la colección en tiempo real y renderiza dinámicamente sus campos en una tabla HTML.
3. **Actualizar (Update):** Carga los datos del producto seleccionado en el formulario para editar sus valores mediante su identificador único (`id`).
4. **Eliminar (Delete):** Solicita confirmación explícita mediante un cuadro de diálogo nativo antes de remover el documento. Si el usuario cancela, el producto se conserva intacto.

---

##  Modelo de Producto (`Producto`)
La estructura de datos definida en la interfaz TypeScript `src/app/models/producto.ts` consta de los siguientes atributos:

export interface Producto {
  id?: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

---

##  Pasos de Configuración de Firebase
1. Crear un proyecto en la consola web de Firebase Console (console.firebase.google.com).
2. Crear una base de datos de Cloud Firestore en modo de prueba o con reglas de lectura/escritura habilitadas.
3. Crear una colección denominada `productos`.
4. Registrar una aplicación Web en el proyecto para obtener las claves del objeto `firebaseConfig`.
5. Agregar las credenciales dentro del archivo `src/environments/environment.ts`:

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "proyectoprueba-52142",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
  }
};

---

##  Instalación y Ejecución Local

1. Clonar el repositorio de GitHub:
   git clone https://github.com/michael200505/Practica_firebase.git
   cd Practica_firebase

2. Instalar las dependencias del proyecto:
   npm install

3. Levantar el servidor local de desarrollo:
   ng serve

4. Abrir la aplicación en el navegador accediendo a http://localhost:4200/
