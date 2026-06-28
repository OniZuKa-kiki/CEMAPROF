<?php

return [
    'whatsapp' => env('WHATSAPP_NUMBER', '212522726068'),
    'mail_admin' => env('MAIL_ADMIN', 'contact@cemaprof.ma'),

    /* Durée d'inactivité avant déconnexion admin (minutes) */
    'admin_session_lifetime' => (int) env('ADMIN_SESSION_LIFETIME', 120),

    'company' => [
        'tagline' => 'Importateur · Distributeur',
        'description' => "Importateur distributeur d'outillage et matériel industriel et agricole, tuyauterie divers, pompe et motopompes, protection individuelle, quincaillerie et droguerie générale.",
        'short_description' => 'Outillage, matériel industriel & agricole, tuyauterie, pompes, EPI, quincaillerie et droguerie — à Casablanca et partout au Maroc.',
        'activity_lines' => [
            'Outillage & matériel industriel et agricole',
            'Tuyauterie divers & raccords',
            'Pompes & motopompes',
            'Protection individuelle (EPI)',
            'Quincaillerie & droguerie générale',
        ],
        'maps_url' => 'https://www.google.com/maps/place/CEMAPROF/data=!4m2!3m1!1s0x0:0x1a6d71e47b226af2',
    ],

    'category_slugs' => [
        'outillage-materiel-industriel',
        'materiel-agricole',
        'tuyauterie-raccords',
        'pompes-motopompes',
        'protection-individuelle',
        'quincaillerie-droguerie',
    ],

    'mail' => [
        'urgent_quote_min_products' => (int) env('MAIL_URGENT_QUOTE_MIN_PRODUCTS', 2),

        'features' => [
            'admin_on_contact' => env('MAIL_FEATURE_ADMIN_ON_CONTACT', true),
            'client_acknowledgment' => env('MAIL_FEATURE_CLIENT_ACK', true),
            'urgent_quote' => env('MAIL_FEATURE_URGENT_QUOTE', true),
            'admin_reply' => env('MAIL_FEATURE_ADMIN_REPLY', true),
            'import_completed' => env('MAIL_FEATURE_IMPORT_COMPLETED', true),
            'weekly_report' => env('MAIL_FEATURE_WEEKLY_REPORT', true),
        ],
    ],
];
