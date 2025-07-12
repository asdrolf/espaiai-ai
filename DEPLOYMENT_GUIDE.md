# Guía de Despliegue - espai.ai

## Configuración DNS en Cloudflare

### 1. Añadir el dominio a Cloudflare
1. Ve a tu dashboard de Cloudflare (https://dash.cloudflare.com)
2. Haz clic en "Add a Site"
3. Introduce `espai.ai`
4. Selecciona el plan (Free está bien para empezar)
5. Sigue el proceso de verificación

### 2. Configurar los nameservers
En tu registrador de dominio (donde compraste `espai.ai`):
1. Busca la sección "DNS" o "Nameservers"
2. Cambia los nameservers a los que te proporciona Cloudflare:
   - Ejemplo: `ns1.cloudflare.com`, `ns2.cloudflare.com`
   - Los nameservers exactos aparecerán en tu dashboard de Cloudflare

### 3. Configurar los registros DNS
Una vez que el dominio esté activo en Cloudflare:

**Registros principales:**
- **Tipo:** `A` o `AAAA`
- **Nombre:** `@` (dominio raíz)
- **Valor:** La IP de tu Worker (se configurará automáticamente)

- **Tipo:** `CNAME`
- **Nombre:** `www`
- **Valor:** `espai.ai`

### 4. Configurar Custom Domain en Cloudflare Workers
1. Ve a tu dashboard de Cloudflare Workers
2. Selecciona tu Worker `espaiai-ai`
3. Ve a la pestaña "Settings" → "Triggers"
4. En "Custom Domains", haz clic en "Add Custom Domain"
5. Añade:
   - `espai.ai`
   - `www.espai.ai`

### 5. Configuración SSL/TLS
1. En tu dashboard de Cloudflare, ve a "SSL/TLS"
2. Configura el modo de cifrado en "Full" o "Full (strict)"
3. En "Edge Certificates", habilita "Always Use HTTPS"
4. Habilita "HTTP Strict Transport Security (HSTS)"

## Despliegue con Wrangler

### Comandos de despliegue:
```bash
# Construir el proyecto
npm run build

# Desplegar a Cloudflare Workers
npx wrangler deploy

# Ver logs en tiempo real
npx wrangler tail
```

### Variables de entorno (si las necesitas):
```bash
# Añadir variables de entorno
npx wrangler secret put VARIABLE_NAME

# Listar variables
npx wrangler secret list
```

## Configuración adicional

### Redirects automáticos
Los redirects de `www.espai.ai` a `espai.ai` se manejan automáticamente con la configuración actual.

### Idiomas
Tu sitio está configurado para múltiples idiomas:
- Inglés (por defecto): `espai.ai`
- Español: `espai.ai/es`
- Catalán: `espai.ai/ca`
- Alemán: `espai.ai/de`

### Monitoreo
- Cloudflare Analytics estará disponible en tu dashboard
- Los logs se pueden ver con `npx wrangler tail`

## Verificación

Una vez completada la configuración:
1. Verifica que `espai.ai` carga correctamente
2. Verifica que `www.espai.ai` redirige a `espai.ai`
3. Verifica que todas las rutas de idiomas funcionan
4. Verifica que el certificado SSL está activo (candado verde en el navegador)

## Troubleshooting

### Si el dominio no funciona:
- Verifica que los nameservers están configurados correctamente
- Espera hasta 24-48 horas para la propagación DNS
- Verifica que el Worker está desplegado correctamente

### Si hay errores SSL:
- Asegúrate de que el modo SSL esté en "Full" o "Full (strict)"
- Verifica que "Always Use HTTPS" está habilitado

### Si las rutas no funcionan:
- Verifica que el Worker esté desplegado con `npx wrangler deploy`
- Revisa los logs con `npx wrangler tail` 