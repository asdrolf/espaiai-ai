# 🚀 Guía de Efectos Espaciales - Espai.ai

## Efectos que deberías ver en el sitio web:

### 1. 🌟 **Estrellas Fugaces** ⭐
- **Cuándo aparecen**: Cada 8-12 segundos
- **Qué ver**: Rayas de luz cyan que cruzan la pantalla de izquierda a derecha
- **Duración**: 3 segundos cada estrella
- **Ubicación**: Mitad superior de la pantalla

### 2. ⚛️ **Átomos Flotantes** 
- **Cuándo aparecen**: Constantemente en segundo plano
- **Qué ver**: 15 partículas pequeñas cyan que flotan suavemente por la pantalla
- **Características**: 
  - Tienen un brillo suave (glow)
  - Se mueven en patrones circulares
  - Tamaño variable (3-5px)
  - Anillo pulsante alrededor de cada partícula

### 3. 🎯 **Efectos de Hover (Mouse)**
- **En botones**: 
  - Brillo cyan alrededor del botón
  - Partículas que se dispersan desde el centro
  - Elevación sutil (translateY)
- **En tarjetas**: 
  - Brillo suave alrededor
  - Elevación sutil
- **En video placeholder**: 
  - Partículas que se dispersan al hacer hover

### 4. ✨ **Efectos de Carga**
- **Al cargar la página**: 
  - Carga rápida sin pantalla de loading
  - Fade-in suave de secciones
  - Timing optimizado para velocidad
- **Al hacer scroll**: 
  - **Efecto Big Bang**: Partículas que explotan desde el centro de cada componente
  - 16 partículas multicolor (cyan, purple, blue)
  - Animación de explosión con escalado y fade-out
  - Diferentes tamaños y colores para variedad

### 5. 🎨 **Animaciones de Componentes**
- **Hero section**: Aparece con fade-in suave
- **Tarjetas**: Aparecen una por una con delay
- **Secciones**: Fade-in escalonado al hacer scroll
- **Headers**: Aparecen con timing específico

## 🎮 Cómo probar los efectos:

### Para ver estrellas fugaces:
1. Espera 3-5 segundos después de cargar la página
2. Mantén la vista en la mitad superior de la pantalla
3. Deberías ver rayas de luz cruzando la pantalla

### Para ver átomos:
1. Mira fijamente cualquier área de la pantalla
2. Busca partículas pequeñas cyan que se mueven suavemente
3. Son más visibles en áreas oscuras del fondo

### Para probar efectos hover:
1. Pasa el mouse sobre cualquier botón
2. Pasa el mouse sobre las tarjetas de características
3. Pasa el mouse sobre el placeholder del video

### Para ver efectos de carga:
1. Recarga la página (F5) - Carga rápida sin delays
2. Haz scroll para ver el efecto Big Bang en cada componente
3. Las partículas explotan desde el centro de cada elemento que aparece

## 🔧 Solución de problemas:

### Si no ves estrellas fugaces:
- Espera más tiempo (pueden tardar hasta 10 segundos)
- Verifica que no tengas `prefers-reduced-motion` activado
- Revisa la consola del navegador por errores

### Si no ves átomos:
- Busca en áreas más oscuras de la pantalla
- Pueden ser sutiles, mira con atención
- Verifica que el z-index esté correcto

### Si no ves efectos hover:
- Asegúrate de que JavaScript esté habilitado
- Verifica que no haya conflictos de CSS
- Prueba en diferentes navegadores

## 🎨 Personalización:

Los efectos están diseñados para ser:
- **Sutiles**: No distraen del contenido
- **Elegantes**: Estilo Apple-quality
- **Performance-optimized**: No afectan la velocidad
- **Accessible**: Respetan `prefers-reduced-motion`

## 🌟 Colores utilizados:
- **Cyan principal**: `#06b6d4` (var(--space-cyan))
- **Brillo**: `rgba(6, 182, 212, 0.6)`
- **Fondo**: `rgba(10, 10, 15, 0.8)` para loader

---

*Los efectos están optimizados para crear una experiencia espacial elegante sin comprometer el rendimiento o la usabilidad del sitio.* 