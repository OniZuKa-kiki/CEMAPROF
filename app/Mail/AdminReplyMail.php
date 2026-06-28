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

class AdminReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactMessage $contactMessage,
        public string $replyBody,
        public string $adminName,
    ) {}

    public function envelope(): Envelope
    {
        $label = ContactMailService::subjectLabel($this->contactMessage->subject);

        return new Envelope(
            subject: "Re: {$label} — CEMAPROF",
            replyTo: [MailRecipientService::primaryContactEmail()],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.contact.admin-reply',
            with: [
                'message' => $this->contactMessage,
                'replyBody' => $this->replyBody,
                'adminName' => $this->adminName,
                'siteName' => SiteSetting::get('site_name', 'CEMAPROF'),
            ],
        );
    }
}
