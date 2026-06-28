<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WeeklyReportMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array<string, mixed>  $stats
     */
    public function __construct(public array $stats) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[CEMAPROF] Rapport hebdomadaire',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.admin.weekly-report',
            with: [
                'stats' => $this->stats,
                'dashboardUrl' => route('admin.dashboard'),
                'messagesUrl' => route('admin.messages.index'),
            ],
        );
    }
}
