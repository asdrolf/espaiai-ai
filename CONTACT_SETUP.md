# Configuración del Formulario de Contacto

El formulario de contacto está completamente implementado con múltiples opciones de envío de emails para sitios web estáticos. Funciona con **EmailJS** como servicio principal, **Formspree** como alternativa, y **mailto** como fallback final.

## 🚀 Características Implementadas

- ✅ **Formulario completamente funcional** en todos los idiomas (EN, ES, CA, DE)
- ✅ **Validación de campos** con mensajes de error localizados
- ✅ **Múltiples servicios de email** con fallback automático
- ✅ **Estados de carga** y feedback visual
- ✅ **Diseño responsive** y accesible
- ✅ **Configuración centralizada** y fácil de mantener

## 📧 Opciones de Configuración

### Opción 1: EmailJS (Recomendado - Gratuito)

EmailJS es perfecto para sitios estáticos ya que permite enviar emails directamente desde el frontend.

#### Pasos de configuración:

1. **Crear cuenta en EmailJS:**
   - Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
   - Crea una cuenta gratuita (hasta 200 emails/mes)

2. **Configurar servicio de email:**
   - Ve a "Email Services" en tu dashboard
   - Conecta tu proveedor de email (Gmail, Outlook, etc.)
   - Copia el `Service ID` generado

3. **Crear plantilla de email:**
   - Ve a "Email Templates" y crea una nueva plantilla
   - Usa estas variables en tu plantilla:
     ```
     Asunto: Nuevo contacto de {{company}} - {{interest}}
     
     De: {{from_name}} <{{from_email}}>
     Empresa: {{company}}
     Teléfono: {{phone}}
     Empleados: {{employees}}
     Interés: {{interest}}
     
     Mensaje:
     {{message}}
     
     ---
     Este email fue enviado desde el formulario de contacto de Espai.ai
     ```
   - Guarda y copia el `Template ID`

4. **Obtener Public Key:**
   - Ve a "Account" → "General" 
   - Copia tu `Public Key`

5. **Actualizar configuración en el código:**
   - En cada archivo de contacto, actualiza estas líneas:
     ```javascript
     const EMAIL_CONFIG = {
       emailjs: {
         serviceId: 'tu_service_id_real',
         templateId: 'tu_template_id_real', 
         publicKey: 'tu_public_key_real',
         enabled: true // ¡Importante! Cambiar a true
       },
       // ... resto de configuración
     };
     ```

### Opción 2: Formspree (Alternativa)

Formspree es otra excelente opción para formularios estáticos.

#### Pasos de configuración:

1. **Crear cuenta en Formspree:**
   - Ve a [https://formspree.io/](https://formspree.io/)
   - Crea una cuenta gratuita (hasta 50 envíos/mes)

2. **Crear un nuevo formulario:**
   - Crea un nuevo formulario y copia el endpoint URL
   - Ejemplo: `https://formspree.io/f/xpzkgqyw`

3. **Actualizar configuración:**
   ```javascript
   const EMAIL_CONFIG = {
     emailjs: {
       // ... configuración EmailJS
       enabled: false // Deshabilitar EmailJS
     },
     formspree: {
       endpoint: 'https://formspree.io/f/tu_form_id',
       enabled: true // Habilitar Formspree
     },
     // ... resto de configuración
   };
   ```

### Opción 3: Mailto (Fallback Automático)

Si no configuras ningún servicio, el formulario automáticamente usará `mailto:` que abrirá el cliente de email del usuario con el formulario pre-completado.

## 🔧 Archivos que Necesitas Actualizar

Para habilitar EmailJS o Formspree, actualiza estos archivos:

- `src/pages/contact.astro` (Inglés)
- `src/pages/es/contact.astro` (Español)
- `src/pages/ca/contact.astro` (Catalán)
- `src/pages/de/contact.astro` (Alemán)

En cada archivo, busca la sección `EMAIL_CONFIG` y actualiza los valores.

## 📋 Campos del Formulario

El formulario captura la siguiente información:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| **Nombre** | Texto | ✅ | Nombre completo del contacto |
| **Email** | Email | ✅ | Dirección de correo electrónico |
| **Empresa** | Texto | ✅ | Nombre de la empresa |
| **Teléfono** | Tel | ❌ | Número de teléfono (opcional) |
| **Empleados** | Select | ✅ | Tamaño de la empresa |
| **Interés** | Select | ✅ | Tipo de servicio de interés |
| **Mensaje** | Textarea | ✅ | Mensaje personalizado |

### Opciones de Empleados:
- 1-10 empleados
- 11-50 empleados  
- 51-200 empleados
- 200+ empleados

### Opciones de Interés:
- Análisis gratuito
- Demostración
- Información de precios
- Otro

## 🎨 Características de UX

- **Validación en tiempo real** con mensajes de error específicos
- **Estados de carga** durante el envío
- **Mensajes de éxito/error** contextuales
- **Diseño responsive** que funciona en todos los dispositivos
- **Accesibilidad completa** con labels, ARIA y navegación por teclado
- **Efectos visuales** suaves y profesionales

## 🔍 Solución de Problemas

### El formulario no envía emails:
1. Verifica que `enabled: true` en la configuración
2. Comprueba que las credenciales son correctas
3. Revisa la consola del navegador para errores
4. Verifica que el dominio está autorizado en EmailJS/Formspree

### Los emails no llegan:
1. Revisa la carpeta de spam
2. Verifica la configuración del servicio de email
3. Comprueba los logs en el dashboard de EmailJS/Formspree

### Error de CORS:
1. Añade tu dominio a la lista blanca en EmailJS
2. Verifica la configuración de Formspree

## 🚀 Próximos Pasos

1. **Elige tu servicio preferido** (EmailJS recomendado)
2. **Configura las credenciales** en los archivos de contacto
3. **Prueba el formulario** en todos los idiomas
4. **Personaliza los mensajes** según tus necesidades
5. **¡Listo para recibir contactos!**

## 📞 Soporte

Si tienes problemas con la configuración, revisa:
- [Documentación de EmailJS](https://www.emailjs.com/docs/)
- [Documentación de Formspree](https://help.formspree.io/)
- Los logs de la consola del navegador para errores específicos

---

**Nota:** El formulario funciona perfectamente sin configuración adicional usando el fallback de mailto, pero para una experiencia profesional completa, se recomienda configurar EmailJS o Formspree. 