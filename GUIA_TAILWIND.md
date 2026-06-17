# 🎨 Guía de Tailwind CSS

---

## 1. 🌙 El Modo Claro y Oscuro (`dark:`)
En Tailwind, tú diseñas normalmente para el modo claro (por defecto). Si quieres que algo cambie cuando el usuario active el modo oscuro, le pones el prefijo `dark:` adelante.

- **`bg-white`**: "Pinta el fondo de blanco" (Para el modo claro).
- **`dark:bg-[#0B1121]`**: "Pero si estamos en modo oscuro, pinta el fondo del color oscuro azulado".
- **`text-gray-900`**: "Texto casi negro" (Para leer bien en fondo blanco).
- **`dark:text-white`**: "Pero si estamos en modo oscuro, pon el texto blanco".

**Ejemplo completo:**
`<div className="bg-white dark:bg-[#0B1121] text-gray-900 dark:text-white">Hola</div>`

---

## 2. 📱 Responsive (Diseño para PC vs Celular)
Tailwind diseña primero pensando en el celular ("Mobile First"). Lo que escribas sin prefijos, se verá en el celular. Si le pones el prefijo `md:` (Medium) o `lg:` (Large), le estás diciendo: "A partir de una pantalla grande, cambia a esto".

- **`hidden`**: "Oculta este elemento" (No se ve en celular).
- **`md:block`**: "Pero si la pantalla es tamaño PC, muéstralo como bloque".
- **`flex-col`**: "Ordena los elementos uno arriba del otro" (Ideal para celulares).
- **`md:flex-row`**: "Pero en PC, ponlos uno al lado del otro".
- **`block md:table-row`**: Así logramos que las filas de tus tablas parezcan "tarjetas" en el celular (bloques apilados) pero vuelvan a ser filas de tabla en la computadora.

---

## 3. 📦 Flexbox (Acomodar cosas mágicamente)
Usamos mucho la palabra `flex`. Es la mejor forma de alinear elementos sin volverse loco.

- **`flex`**: "Convierte esta caja en un contenedor flexible".
- **`items-center`**: "Centra todo verticalmente" (Arriba y abajo).
- **`justify-center`**: "Centra todo horizontalmente" (Izquierda a derecha).
- **`justify-between`**: "Empuja un elemento a la extrema izquierda y el otro a la extrema derecha" (Lo usamos mucho en los encabezados).
- **`gap-3`**: "Deja una separación de tamaño 3 entre los elementos" (Así no tienes que ponerle márgenes a cada uno).

---

## 4. 🎨 Colores, Fondos y Bordes
Tailwind tiene una paleta de colores. El número (ej. `500`) indica qué tan fuerte es. 50 es casi blanco, 500 es el color normal, 900 es casi negro.

- **`bg-emerald-500`**: Fondo color verde esmeralda (usado en tus botones de guardar).
- **`bg-rose-500/10`**: Fondo color rojo rosa, pero el `/10` significa que tiene **10% de opacidad**. (Así logramos esos fondos claritos hermosos detrás de los iconos de eliminar).
- **`text-slate-400`**: Texto gris azulado medio oscuro.
- **`border`**: "Ponle un borde fino".
- **`border-gray-200 dark:border-gray-800`**: "Borde gris claro en modo normal, pero borde gris muy oscuro en modo oscuro".

---

## 5. 🔲 Formas y Sombras
- **`rounded-xl`**: "Bordes bastante redondeados" (Hace que todo parezca más moderno como una app).
- **`rounded-full`**: "Borde totalmente redondo" (Lo usamos para círculos perfectos o botones en forma de pastilla).
- **`shadow-xl`**: "Sombra grande". Levanta el elemento del fondo dando un efecto 3D sutil.
- **`shadow-inner`**: "Sombra hacia adentro" (Hace que parezca hundido, lo usamos en los campos donde escribes texto).

---

## 6. ✨ Animaciones y Efectos (El "Hover")
- **`hover:bg-emerald-600`**: "Cuando el usuario pase el ratón (mouse) por encima, cambia el fondo a verde un poco más oscuro".
- **`transition-colors` o `transition-all`**: Hace que el cambio del hover sea suave (una animación de difuminado) y no de golpe.
- **`duration-200`**: La transición dura 200 milisegundos.

---

### Resumen de cómo construimos un "Botón Moderno"
```jsx
<button className="
    flex items-center gap-2           // Flexible, centra y separa el icono del texto
    px-4 py-2                         // Espacio interno (Padding horizontal y vertical)
    bg-white dark:bg-slate-800        // Blanco de día, gris oscuro de noche
    text-gray-900 dark:text-white     // Texto oscuro de día, blanco de noche
    border border-gray-200            // Borde sutil
    rounded-xl                        // Bordes bonitos y modernos
    hover:bg-gray-50                  // Que brille un poquito al pasar el mouse
    transition-all                    // Que el cambio de color sea suave
">
   Guardar
</button>
```

