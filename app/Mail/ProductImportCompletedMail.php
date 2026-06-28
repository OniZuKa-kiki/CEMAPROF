<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProductImportCompletedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  list<string>  $errors
     */
    public function __construct(
        public int $created,
        public int $skipped,
        public array $errors,
        public string $adminName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[CEMAPROF] Import produits terminé',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.admin.import-completed',
            with: [
                'created' => $this->created,
                'skipped' => $this->skipped,
                'errors' => $this->errors,
                'adminName' => $this->adminName,
                'productsUrl' => route('admin.products.index'),
            ],
        );
    }
}
