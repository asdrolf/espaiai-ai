# Configuración del Formulario de Contacto

El formulario de contacto está configurado para funcionar con **EmailJS** como servicio principal y tiene un fallback a **mailto** si EmailJS no está configurado.

## Opción 1: EmailJS (Recomendado)

### Configuración:

1. **Crear cuenta en EmailJS:**
   - Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
   - Crea una cuenta gratuita (hasta 200 emails/mes)

2. **Configurar servicio de email:**
   - Ve a "Email Services" y conecta tu proveedor (Gmail, Outlook, etc.)
   - Anota el `Service ID`

3. **Crear plantilla de email:**
   - Ve a "Email Templates" y crea una nueva plantilla
   - Usa estas variables en la plantilla:
     ```
     From: {{name}} <{{email}}>
     Company: {{company}}
     Phone: {{phone}}
     Employees: {{employees}}
     Interest: {{interest}}
     
     Message:
     {{message}}
     ```
   - Anota el `Template ID`

4. **Obtener Public Key:**
   - Ve a "Account" → "General" 
   - Copia tu `Public Key`

5. **Actualizar configuración:**
   - En cada archivo de contacto (`src/pages/contact.astro`, `src/pages/es/contact.astro`, etc.)
   - Reemplaza estas líneas:
     ```javascript
     const EMAILJS_SERVICE_ID = 'your_service_id';
     const EMAILJS_TEMPLATE_ID = 'your_template_id';
     const EMAILJS_PUBLIC_KEY = 'your_public_key';
     ```
   - Con tus valores reales

## Opción 2: Fallback Mailto

Si no configuras EmailJS, el formulario automáticamente usará `mailto:` que abrirá el cliente de email del usuario con el formulario pre-completado.

## Opción 3: Otros Servicios

### Formspree
1. Ve a [https://formspree.io/](https://formspree.io/)
2. Crea una cuenta y obtén tu endpoint
3. Reemplaza la función `sendEmailFallback` con:
   ```javascript
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     body: formData,
     headers: { 'Accept': 'application/json' }
   });
   ```

### Netlify Forms
Si usas Netlify para hosting, simplemente agrega `data-netlify="true"` al formulario.

## Estructura del Formulario

El formulario captura:
- **Nombre completo** (requerido)
- **Email** (requerido)
- **Empresa** (requerido)
- **Teléfono** (opcional)
- **Número de empleados** (requerido)
- **Tipo de interés** (requerido): Análisis gratuito, Demo, Precios, Otro
- **Mensaje** (requerido)

## Validación

El formulario incluye:
- Validación de campos requeridos
- Validación de formato de email
- Mensajes de error en el idioma correspondiente
- Estados de carga durante el envío

## Estilos

El formulario está completamente estilizado con:
- Diseño responsive
- Efectos hover y focus
- Mensajes de éxito/error
- Loader durante el envío
- Tema consistente con el resto del sitio

## Accesibilidad

- Labels asociados correctamente
- Mensajes de error descriptivos
- Navegación por teclado
- Contraste adecuado
- Texto alternativo para iconos 