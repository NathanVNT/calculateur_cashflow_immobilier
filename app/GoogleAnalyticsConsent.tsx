'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Stack,
    Container
} from '@mui/material';

// Déclaration du type pour gtag
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

export default function GoogleAnalyticsConsent() {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log('GoogleAnalyticsConsent monté');
        // Vérifier côté client uniquement après montage
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Délai pour s'assurer que la page est chargée
            setTimeout(() => setVisible(true), 1000);
        } else if (consent === 'accepted') {
            initializeGoogleAnalytics();
        }
    }, []);

    const initializeGoogleAnalytics = () => {
        const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

        if (!GA_MEASUREMENT_ID) {
            console.warn('GA_MEASUREMENT_ID non défini');
            return;
        }

        // Éviter de charger plusieurs fois
        if (document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`)) {
            return;
        }

        // Charger le script Google Analytics
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        script.async = true;
        document.head.appendChild(script);

        // Initialiser gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
            window.dataLayer.push(arguments);
        };

        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID, {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
        });

        console.log('Google Analytics initialisé');
    };

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setVisible(false);
        initializeGoogleAnalytics();
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setVisible(false);

        // Désactiver Google Analytics si déjà chargé
        if (window.gtag) {
            window.gtag('consent', 'update', {
                analytics_storage: 'denied'
            });
        }
    };

    // Ne pas afficher côté serveur pour éviter les erreurs d'hydratation
    if (!mounted || !visible) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10000,
                p: { xs: 2, sm: 3 },
                background: 'linear-gradient(135deg, rgba(224, 231, 255, 0.95) 0%, rgba(240, 253, 250, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
        >
            <Container maxWidth="lg">
                <Paper
                    elevation={12}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        mx: 'auto',
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={3}
                        alignItems={{ xs: 'stretch', md: 'center' }}
                        justifyContent="space-between"
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    color: 'primary.main',
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                }}
                            >
                                🍪 Cookies & Analyse
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    lineHeight: 1.6,
                                    fontSize: { xs: '0.875rem', sm: '0.9rem' }
                                }}
                            >
                                Ce site utilise Google Analytics pour analyser le trafic et améliorer votre expérience.
                                Les données sont collectées de manière anonyme et nous respectons votre vie privée.
                            </Typography>
                        </Box>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ minWidth: { sm: 'auto', md: '280px' } }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleDecline}
                                size="medium"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    '&:hover': {
                                        borderColor: 'primary.dark',
                                        backgroundColor: 'primary.50',
                                    }
                                }}
                            >
                                Refuser
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleAccept}
                                size="medium"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                    boxShadow: '0 3px 8px rgba(25, 118, 210, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                                    }
                                }}
                            >
                                Accepter
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}