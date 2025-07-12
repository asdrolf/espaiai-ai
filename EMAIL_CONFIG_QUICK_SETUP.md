# ⚡ Configuración Rápida del Formulario de Contacto

## 🎯 Opción Rápida: EmailJS (5 minutos)

### 1. Crear cuenta EmailJS
- Ve a [emailjs.com](https://www.emailjs.com/) → Sign Up
- Confirma tu email

### 2. Configurar servicio de email
- Dashboard → Email Services → Add Service
- Elige tu proveedor (Gmail/Outlook/etc.)
- Conecta tu cuenta
- **Copia el Service ID** (ej: `service_abc123`)

### 3. Crear plantilla
- Dashboard → Email Templates → Create Template
- Pega esta plantilla:

```
Subject: Nuevo contacto de {{company}} - {{interest}}

De: {{from_name}} <{{from_email}}>
Empresa: {{company}}
Teléfono: {{phone}}
Empleados: {{employees}}
Interés: {{interest}}

Mensaje:
{{message}}
```

- Guarda y **copia el Template ID** (ej: `template_xyz789`)

### 4. Obtener Public Key
- Dashboard → Account → General
- **Copia tu Public Key** (ej: `pk_abc123xyz`)

### 5. Actualizar código
Busca `EMAIL_CONFIG` en estos archivos y actualiza:

- `src/pages/contact.astro`
- `src/pages/es/contact.astro`
- `src/pages/ca/contact.astro`
- `src/pages/de/contact.astro`

```javascript
const EMAIL_CONFIG = {
  emailjs: {
    serviceId: 'service_abc123',        // 👈 Tu Service ID
    templateId: 'template_xyz789',      // 👈 Tu Template ID
    publicKey: 'pk_abc123xyz',          // 👈 Tu Public Key
    enabled: true                       // 👈 Cambiar a true
  },
  // ... resto igual
};
```

## 🚀 ¡Listo! 

Tu formulario ya puede enviar emails. Pruébalo en tu sitio web.

---

## 🔄 Alternativa: Formspree (3 minutos)

### 1. Crear cuenta Formspree
- Ve a [formspree.io](https://formspree.io/) → Sign Up

### 2. Crear formulario
- Dashboard → New Form
- **Copia el endpoint** (ej: `https://formspree.io/f/xpzkgqyw`)

### 3. Actualizar código
```javascript
const EMAIL_CONFIG = {
  emailjs: {
    // ... configuración EmailJS
    enabled: false                      // 👈 Deshabilitar EmailJS
  },
  formspree: {
    endpoint: 'https://formspree.io/f/xpzkgqyw',  // 👈 Tu endpoint
    enabled: true                       // 👈 Habilitar Formspree
  },
  // ... resto igual
};
```

## 🆘 Fallback Automático

Si no configuras nada, el formulario usará `mailto:` automáticamente (abre el cliente de email del usuario).

## 🐛 Problemas Comunes

**❌ No envía emails:**
- Verifica que `enabled: true`
- Revisa la consola del navegador (F12)
- Comprueba las credenciales

**❌ Los emails no llegan:**
- Revisa spam
- Verifica configuración del servicio

**❌ Error de CORS:**
- Añade tu dominio en EmailJS settings
- Verifica configuración de Formspree

## 📧 Configuración de Email Recomendada

Para EmailJS, usa esta configuración en tu template:

**To Email:** tu-email@empresa.com
**From Name:** {{from_name}}
**From Email:** {{from_email}}
**Reply To:** {{from_email}}

Esto asegura que puedas responder directamente al cliente. 