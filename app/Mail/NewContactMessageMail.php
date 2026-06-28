<?php

namespace App\Mail;

use App\Models\ContactMessage;
use App\Services\ContactMailService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        $label = ContactMailService::subjectLabel($this->contactMessage->subject);

        return new Envelope(
            subject: "[CEMAPROF] Nouveau message — {$label}",
            replyTo: [$this->contactMessage->email => $this->contactMessage->name],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.contact.new-admin',
            with: [
                'message' => $this->contactMessage,
                'subjectLabel' => ContactMailService::subjectLabel($this->contactMessage->subject),
                'productNames' => ContactMailService::productNames($this->contactMessage),
                'adminUrl' => route('admin.messages.show', $this->contactMessage),
            ],
        );
    }
}
