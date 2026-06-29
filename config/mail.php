<?php

$resendApiKey = env('RESEND_API_KEY');
$configuredMailer = env('MAIL_MAILER');
$resendHost = env('MAIL_HOST', 'smtp.resend.com');

/*
| Railway (et beaucoup d'hébergeurs) bloquent le SMTP sortant (port 587).
| Quand Resend est configuré via smtp.resend.com + clé API, on bascule
| automatiquement sur l'API HTTPS Resend — bien plus fiable en production.
*/
if ($configuredMailer === 'smtp' && $resendApiKey && $resendHost === 'smtp.resend.com') {
    $configuredMailer = 'resend';
} elseif (! $configuredMailer) {
    $configuredMailer = $resendApiKey ? 'resend' : 'log';
}

return [

    'default' => $configuredMailer,

    'mailers' => [

        'smtp' => [
            'transport' => 'smtp',
            'scheme' => env('MAIL_SCHEME') ?: null,
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', '127.0.0.1'),
            'port' => env('MAIL_PORT', 2525),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => (int) env('MAIL_TIMEOUT', 10),
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url((string) env('APP_URL', 'http://localhost'), PHP_URL_HOST)),
        ],

        'resend_smtp' => [
            'transport' => 'smtp',
            'scheme' => null,
            'host' => env('MAIL_HOST', 'smtp.resend.com'),
            'port' => (int) env('MAIL_PORT', 587),
            'username' => env('MAIL_USERNAME', 'resend'),
            'password' => env('MAIL_PASSWORD') ?: $resendApiKey,
            'timeout' => (int) env('MAIL_TIMEOUT', 10),
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url((string) env('APP_URL', 'http://localhost'), PHP_URL_HOST)),
        ],

        'ses' => [
            'transport' => 'ses',
        ],

        'postmark' => [
            'transport' => 'postmark',
        ],

        'resend' => [
            'transport' => 'resend',
            'key' => $resendApiKey,
        ],

        'sendmail' => [
            'transport' => 'sendmail',
            'path' => env('MAIL_SENDMAIL_PATH', '/usr/sbin/sendmail -bs -i'),
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

    ],

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'onboarding@resend.dev'),
        'name' => env('MAIL_FROM_NAME', env('APP_NAME', 'CEMAPROF')),
    ],

];
