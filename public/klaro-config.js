var klaroConfig = {
    version: 1,
    elementID: 'klaro',
    storageMethod: 'cookie',
    cookieName: 'klaro',
    htmlTexts: true,
    default: false,
    mustConsent: false,
    noticeAsModal: false, // Keep corner style but with accessibility improvements
    acceptAll: true,
    hideDeclineAll: false,
    // Add accessibility improvements while keeping corner style
    styling: {
        theme: ['bottom', 'corner'],
        additionalClass: 'klaro-accessibility-enhanced'
    },
    translations: {
        en: {
            consentModal: {
                title: 'Cookie consent',
                description: 'We use cookies to ensure you get the best experience. You can choose which cookies you want to allow.',
                acceptAll: 'Accept all cookies',
                acceptSelected: 'Accept selected cookies',
                declineAll: 'Decline all cookies',
                close: 'Close cookie settings'
            },
            notice: {
                title: 'Cookie consent',
                description: 'We use cookies to ensure you get the best experience. You can choose which cookies you want to allow.',
                acceptAll: 'Accept all cookies',
                acceptSelected: 'Accept selected cookies',
                declineAll: 'Decline all cookies',
                close: 'Close cookie settings'
            },
            googleAnalytics: {
                description: 'Google Analytics is used to collect anonymous usage statistics.',
                title: 'Google Analytics'
            },
            youtube: {
                description: 'YouTube is required to display our demo video. YouTube may set cookies for analytics and personalization. You need to accept this to watch videos on our site.',
                title: 'YouTube Videos'
            },
            purposes: {
                analytics: 'Analytics'
            },
            ok: 'OK',
            accept: 'Accept',
            decline: 'Decline',
            save: 'Save settings',
            close: 'Close'
        },
        es: {
            consentModal: {
                title: 'Consentimiento de cookies',
                description: 'Utilizamos cookies para asegurarnos de que obtienes la mejor experiencia. Puedes elegir qué cookies permitir.',
                acceptAll: 'Aceptar todas las cookies',
                acceptSelected: 'Aceptar cookies seleccionadas',
                declineAll: 'Rechazar todas las cookies',
                close: 'Cerrar configuración de cookies'
            },
            notice: {
                title: 'Consentimiento de cookies',
                description: 'Utilizamos cookies para asegurarnos de que obtienes la mejor experiencia. Puedes elegir qué cookies permitir.',
                acceptAll: 'Aceptar todas las cookies',
                acceptSelected: 'Aceptar cookies seleccionadas',
                declineAll: 'Rechazar todas las cookies',
                close: 'Cerrar configuración de cookies'
            },
            googleAnalytics: {
                description: 'Google Analytics se utiliza para recopilar estadísticas de uso anónimas.',
                title: 'Google Analytics'
            },
            youtube: {
                description: 'YouTube es necesario para mostrar nuestro video de demostración. YouTube puede establecer cookies para análisis y personalización. Necesitas aceptar esto para ver videos en nuestro sitio.',
                title: 'Videos de YouTube'
            },
            purposes: {
                analytics: 'Analítica'
            },
            ok: 'Aceptar',
            accept: 'Aceptar',
            decline: 'Rechazar',
            save: 'Guardar configuración',
            close: 'Cerrar'
        },
        ca: {
            consentModal: {
                title: 'Consentiment de cookies',
                description: 'Utilitzem cookies per assegurar-nos que obtens la millor experiència. Pots triar quines cookies vols permetre.',
                acceptAll: 'Acceptar totes les cookies',
                acceptSelected: 'Acceptar cookies seleccionades',
                declineAll: 'Rebutjar totes les cookies',
                close: 'Tancar configuració de cookies'
            },
            notice: {
                title: 'Consentiment de cookies',
                description: 'Utilitzem cookies per assegurar-nos que obtens la millor experiència. Pots triar quines cookies vols permetre.',
                acceptAll: 'Acceptar totes les cookies',
                acceptSelected: 'Acceptar cookies seleccionades',
                declineAll: 'Rebutjar totes les cookies',
                close: 'Tancar configuració de cookies'
            },
            googleAnalytics: {
                description: 'Google Analytics s\'utilitza per recopilar estadístiques d\'ús anònimes.',
                title: 'Google Analytics'
            },
            youtube: {
                description: 'YouTube és necessari per mostrar el nostre vídeo de demostració. YouTube pot establir cookies per a l\'anàlisi i la personalització. Has d\'acceptar això per veure vídeos al nostre lloc.',
                title: 'Vídeos de YouTube'
            },
            purposes: {
                analytics: 'Analítica'
            },
            ok: 'D\'acord',
            accept: 'Acceptar',
            decline: 'Rebutjar',
            save: 'Desar configuració',
            close: 'Tancar'
        },
        de: {
            consentModal: {
                title: 'Cookie-Einwilligung',
                description: 'Wir verwenden Cookies, um sicherzustellen, dass Sie die beste Erfahrung machen. Sie können auswählen, welche Cookies Sie zulassen möchten.',
                acceptAll: 'Alle Cookies akzeptieren',
                acceptSelected: 'Ausgewählte Cookies akzeptieren',
                declineAll: 'Alle Cookies ablehnen',
                close: 'Cookie-Einstellungen schließen'
            },
            notice: {
                title: 'Cookie-Einwilligung',
                description: 'Wir verwenden Cookies, um sicherzustellen, dass Sie die beste Erfahrung machen. Sie können auswählen, welche Cookies Sie zulassen möchten.',
                acceptAll: 'Alle Cookies akzeptieren',
                acceptSelected: 'Ausgewählte Cookies akzeptieren',
                declineAll: 'Alle Cookies ablehnen',
                close: 'Cookie-Einstellungen schließen'
            },
            googleAnalytics: {
                description: 'Google Analytics wird verwendet, um anonyme Nutzungsstatistiken zu sammeln.',
                title: 'Google Analytics'
            },
            youtube: {
                description: 'YouTube wird benötigt, um unser Demo-Video anzuzeigen. YouTube kann Cookies für Analysen und Personalisierung setzen. Sie müssen dies akzeptieren, um Videos auf unserer Website anzusehen.',
                title: 'YouTube Videos'
            },
            purposes: {
                analytics: 'Analyse'
            },
            ok: 'OK',
            accept: 'Akzeptieren',
            decline: 'Ablehnen',
            save: 'Einstellungen speichern',
            close: 'Schließen'
        }
    },
    services: [
        {
            name: 'googleAnalytics',
            title: 'Google Analytics',
            purposes: ['analytics'],
            cookies: [/^_ga/, /^_gid/, /^_gat/],
            required: false,
            optOut: false,
            onlyOnce: true
        },
        {
            name: 'youtube',
            title: 'YouTube',
            purposes: ['analytics'],
            cookies: [/^VISITOR_INFO1_LIVE/, /^LOGIN_INFO/, /^SID/, /^HSID/, /^SSID/, /^APISID/, /^SAPISID/, /^__Secure-1PSID/, /^__Secure-3PSID/],
            required: false,
            optOut: false,
            onlyOnce: true
        }
    ]
}; 