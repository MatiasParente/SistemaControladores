## Guía de uso local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

### 2. Configurar las variables de entorno

Copiar el archivo `.env.example` a `.env` y completar las credenciales correspondientes a la base de datos y demás servicios requeridos.

### 3. Ejecutar migraciones y seeders

Crear la estructura de la base de datos y cargar datos iniciales (si aplica):

```bash
php artisan migrate --seed
```

### 4. Iniciar el entorno de desarrollo

En terminales separadas, ejecutar:

```bash
php artisan serve
```

```bash
npm run dev
```

### 5. Verificar el funcionamiento

Abrir la aplicación en el navegador y comprobar que todos los servicios se encuentren operativos.
