var klaroConfig = {
    version: 1,
    elementID: 'klaro',
    storageMethod: 'cookie',
    cookieName: 'klaro',
    htmlTexts: true,
    default: false,
    mustConsent: false,
    noticeAsModal: false,
    acceptAll: true,
    hideDeclineAll: false,
    translations: {
        en: {
            consentModal: {
                title: 'Cookie consent',
                description: 'We use cookies to ensure you get the best experience. You can choose which cookies you want to allow.'
            },
            googleAnalytics: {
                description: 'Google Analytics is used to collect anonymous usage statistics.'
            },
            purposes: {
                analytics: 'Analytics'
            }
        },
        es: {
            consentModal: {
                title: 'Consentimiento de cookies',
                description: 'Utilizamos cookies para asegurarnos de que obtienes la mejor experiencia. Puedes elegir qué cookies permitir.'
            },
            googleAnalytics: {
                description: 'Google Analytics se utiliza para recopilar estadísticas de uso anónimas.'
            },
            purposes: {
                analytics: 'Analítica'
            }
        },
        ca: {
            consentModal: {
                title: 'Consentiment de cookies',
                description: 'Utilitzem cookies per assegurar-nos que obtens la millor experiència. Pots triar quines cookies vols permetre.'
            },
            googleAnalytics: {
                description: 'Google Analytics s\'utilitza per recopilar estadístiques d\'ús anònimes.'
            },
            purposes: {
                analytics: 'Analítica'
            }
        },
        de: {
            consentModal: {
                title: 'Cookie-Einwilligung',
                description: 'Wir verwenden Cookies, um sicherzustellen, dass Sie die beste Erfahrung machen. Sie können auswählen, welche Cookies Sie zulassen möchten.'
            },
            googleAnalytics: {
                description: 'Google Analytics wird verwendet, um anonyme Nutzungsstatistiken zu sammeln.'
            },
            purposes: {
                analytics: 'Analyse'
            }
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
        }
    ]
}; 