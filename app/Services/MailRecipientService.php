<?php

namespace App\Services;

use App\Models\SiteSetting;

class MailRecipientService
{
    /**
     * Active notification inboxes (primary + optional secondary/tertiary when enabled).
     *
     * @return list<string>
     */
    public static function notificationRecipients(): array
    {
        $settings = SiteSetting::allCached();

        $emails = [];

        if (! empty($settings['email'])) {
            $emails[] = $settings['email'];
        }

        if (self::isEnabled($settings['email_secondary_enabled'] ?? '0') && ! empty($settings['email_secondary'])) {
            $emails[] = $settings['email_secondary'];
        }

        if (self::isEnabled($settings['email_tertiary_enabled'] ?? '0') && ! empty($settings['email_tertiary'])) {
            $emails[] = $settings['email_tertiary'];
        }

        $envAdmin = config('cemaprof.mail_admin');

        if ($envAdmin) {
            $emails[] = $envAdmin;
        }

        $emails = array_values(array_unique(array_filter(array_map(
            fn (string $email) => strtolower(trim($email)),
            $emails,
        ))));

        return $emails ?: ['contact@cemaprof.ma'];
    }

    public static function primaryContactEmail(): string
    {
        return SiteSetting::get('email')
            ?: config('cemaprof.mail_admin')
            ?: 'contact@cemaprof.ma';
    }

    public static function isFeatureEnabled(string $feature): bool
    {
        return (bool) config("cemaprof.mail.features.{$feature}", true);
    }

    private static function isEnabled(mixed $value): bool
    {
        return in_array((string) $value, ['1', 'true', 'on', 'yes'], true);
    }
}
