<?php

namespace App\Console\Commands;

use App\Mail\WeeklyReportMail;
use App\Models\ContactMessage;
use App\Models\Product;
use App\Services\MailRecipientService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendWeeklyReportCommand extends Command
{
    protected $signature = 'cemaprof:weekly-report';

    protected $description = 'Envoie le rapport hebdomadaire aux adresses de notification CEMAPROF';

    public function handle(): int
    {
        if (! MailRecipientService::isFeatureEnabled('weekly_report')) {
            $this->info('Rapport hebdomadaire désactivé (config).');

            return self::SUCCESS;
        }

        $start = now()->subWeek()->startOfDay();
        $end = now();

        $quoteMessages = ContactMessage::query()
            ->where('subject', 'devis')
            ->whereBetween('created_at', [$start, $end]);

        $topProducts = ContactMessage::query()
            ->where('subject', 'devis')
            ->whereBetween('created_at', [$start, $end])
            ->whereNotNull('product_slug')
            ->select('product_slug', DB::raw('count(*) as total'))
            ->groupBy('product_slug')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(function ($row) {
                $product = Product::query()->where('slug', $row->product_slug)->first(['name']);

                return [
                    'name' => $product?->name ?? $row->product_slug,
                    'count' => (int) $row->total,
                ];
            })
            ->all();

        $stats = [
            'period' => $start->locale('fr')->isoFormat('D MMM').' → '.$end->locale('fr')->isoFormat('D MMM YYYY'),
            'messages_total' => ContactMessage::whereBetween('created_at', [$start, $end])->count(),
            'messages_unread' => ContactMessage::where('is_read', false)->count(),
            'quotes_total' => (clone $quoteMessages)->count(),
            'products_active' => Product::where('is_active', true)->count(),
            'products_featured' => Product::where('is_featured', true)->count(),
            'top_products' => $topProducts,
        ];

        $mailable = new WeeklyReportMail($stats);

        foreach (MailRecipientService::notificationRecipients() as $recipient) {
            try {
                Mail::to($recipient)->send($mailable);
                $this->line("Rapport envoyé à {$recipient}");
            } catch (\Throwable $exception) {
                Log::warning('Weekly report mail failed', [
                    'recipient' => $recipient,
                    'error' => $exception->getMessage(),
                ]);
                $this->error("Échec pour {$recipient}");
            }
        }

        return self::SUCCESS;
    }
}
