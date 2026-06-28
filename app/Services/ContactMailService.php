<?php

namespace App\Services;

use App\Mail\ContactAcknowledgmentMail;
use App\Mail\NewContactMessageMail;
use App\Mail\UrgentQuoteAlertMail;
use App\Models\ContactMessage;
use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactMailService
{
    public static function sendForMessage(ContactMessage $message): void
    {
        $message->loadMissing([]);

        if (MailRecipientService::isFeatureEnabled('admin_on_contact')) {
            self::sendToAdmins(new NewContactMessageMail($message));
        }

        if (MailRecipientService::isFeatureEnabled('client_acknowledgment')) {
            self::sendToClient($message, new ContactAcknowledgmentMail($message));
        }

        if (
            MailRecipientService::isFeatureEnabled('urgent_quote')
            && $message->subject === 'devis'
            && count($message->product_slugs ?? []) >= (int) config('cemaprof.mail.urgent_quote_min_products', 2)
        ) {
            self::sendToAdmins(new UrgentQuoteAlertMail($message));
        }
    }

    public static function sendAdminReply(ContactMessage $message, string $replyBody, string $adminName): void
    {
        if (! MailRecipientService::isFeatureEnabled('admin_reply')) {
            return;
        }

        self::sendToClient(
            $message,
            new \App\Mail\AdminReplyMail($message, $replyBody, $adminName),
        );
    }

    public static function subjectLabel(string $subject): string
    {
        return match ($subject) {
            'devis' => 'Demande de devis',
            'info-produit' => 'Information produit',
            'sav' => 'Service après-vente',
            'autre' => 'Autre demande',
            default => ucfirst($subject),
        };
    }

    /**
     * @return list<string>
     */
    public static function productNames(ContactMessage $message): array
    {
        $slugs = $message->product_slugs ?? array_filter([$message->product_slug]);

        if (empty($slugs)) {
            return [];
        }

        $names = Product::query()
            ->whereIn('slug', $slugs)
            ->pluck('name', 'slug');

        return collect($slugs)
            ->map(fn (string $slug) => $names[$slug] ?? $slug)
            ->values()
            ->all();
    }

    private static function sendToAdmins(object $mailable): void
    {
        foreach (MailRecipientService::notificationRecipients() as $recipient) {
            self::safeSend($recipient, $mailable);
        }
    }

    private static function sendToClient(ContactMessage $message, object $mailable): void
    {
        self::safeSend($message->email, $mailable);
    }

    private static function safeSend(string $recipient, object $mailable): void
    {
        try {
            Mail::to($recipient)->send($mailable);
        } catch (\Throwable $exception) {
            Log::warning('CEMAPROF mail delivery failed', [
                'recipient' => $recipient,
                'mailable' => $mailable::class,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
