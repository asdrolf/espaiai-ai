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
            googleAnalytics: {
                description: 'Google Analytics is used to collect anonymous usage statistics.',
                title: 'Google Analytics'
            },
            youtube: {
                description: 'YouTube is used to display video content. YouTube may set cookies for analytics and personalization.',
                title: 'YouTube'
            },
            purposes: {
                analytics: 'Analytics'
            },
            // Add accessibility-specific translations
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
            googleAnalytics: {
                description: 'Google Analytics se utiliza para recopilar estadísticas de uso anónimas.',
                title: 'Google Analytics'
            },
            youtube: {
                description: 'YouTube se utiliza para mostrar contenido de video. YouTube puede establecer cookies para análisis y personalización.',
                title: 'YouTube'
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
            googleAnalytics: {
                description: 'Google Analytics s\'utilitza per recopilar estadístiques d\'ús anònimes.',
                title: 'Google Analytics'
            },
            youtube: {
                description: 'YouTube s\'utilitza per mostrar contingut de vídeo. YouTube pot establir cookies per a l\'anàlisi i la personalització.',
                title: 'YouTube'
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
            googleAnalytics: {
                description: 'Google Analytics wird verwendet, um anonyme Nutzungsstatistiken zu sammeln.',
                title: 'Google Analytics'
            },
            youtube: {
                description: 'YouTube wird verwendet, um Videoinhalte anzuzeigen. YouTube kann Cookies für Analysen und Personalisierung setzen.',
                title: 'YouTube'
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