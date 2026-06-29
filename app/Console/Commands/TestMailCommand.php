<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMailCommand extends Command
{
    protected $signature = 'cemaprof:test-mail {email? : Destinataire (défaut: MAIL_ADMIN)}';

    protected $description = 'Envoie un e-mail de test via la configuration mail active';

    public function handle(): int
    {
        $recipient = $this->argument('email') ?: config('cemaprof.mail_admin');

        $this->info('Mailer actif : '.config('mail.default'));
        $this->info('Expéditeur   : '.config('mail.from.address'));
        $this->info('Destinataire : '.$recipient);
        $this->info('Resend key   : '.(config('services.resend.key') ? 'définie' : 'manquante'));

        try {
            Mail::raw(
                'Test CEMAPROF — '.now()->toDateTimeString()."\nSi vous recevez ceci, la configuration mail fonctionne.",
                fn ($message) => $message
                    ->to($recipient)
                    ->subject('[CEMAPROF] Test e-mail production')
            );

            $this->info('E-mail de test envoyé avec succès.');

            return self::SUCCESS;
        } catch (\Throwable $exception) {
            $this->error('Échec : '.$exception->getMessage());

            return self::FAILURE;
        }
    }
}
