<?php

namespace App\Mail;

use App\Models\ContactMessage;
use App\Models\SiteSetting;
use App\Services\ContactMailService;
use App\Services\MailRecipientService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactAcknowledgmentMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'CEMAPROF — Nous avons bien reçu votre message',
            replyTo: [MailRecipientService::primaryContactEmail()],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.contact.acknowledgment',
            with: [
                'message' => $this->contactMessage,
                'subjectLabel' => ContactMailService::subjectLabel($this->contactMessage->subject),
                'siteName' => SiteSetting::get('site_name', 'CEMAPROF'),
                'contactPhone' => SiteSetting::get('phone'),
            ],
        );
    }
}
