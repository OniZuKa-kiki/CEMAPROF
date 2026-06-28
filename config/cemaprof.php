<?php

return [
    'whatsapp' => env('WHATSAPP_NUMBER', '212600000000'),
    'mail_admin' => env('MAIL_ADMIN', 'contact@cemaprof.ma'),

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
