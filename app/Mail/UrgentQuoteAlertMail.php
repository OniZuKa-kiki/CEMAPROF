<?php

namespace App\Mail;

use App\Models\ContactMessage;
use App\Services\ContactMailService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UrgentQuoteAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        $count = count($this->contactMessage->product_slugs ?? []);

        return new Envelope(
            subject: "[CEMAPROF] Devis prioritaire — {$count} produit(s)",
            replyTo: [$this->contactMessage->email => $this->contactMessage->name],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.contact.urgent-quote',
            with: [
                'message' => $this->contactMessage,
                'productNames' => ContactMailService::productNames($this->contactMessage),
                'adminUrl' => route('admin.messages.show', $this->contactMessage),
            ],
        );
    }
}
