<?php

namespace App\Http\Controllers\Admin;

use App\Mail\ProductImportCompletedMail;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\AuditLogger;
use App\Services\MailRecipientService;
use App\Services\ProductImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProductImportController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/Products/Import', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'columns' => ProductImportService::TEMPLATE_HEADERS,
        ]);
    }

    public function template(ProductImportService $importer): StreamedResponse
    {
        return response()->streamDownload(function () use ($importer) {
            echo "\xEF\xBB\xBF".$importer->templateCsv();
        }, 'modele-import-produits.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function store(Request $request, ProductImportService $importer): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ], [
            'file.required' => 'Veuillez sélectionner un fichier CSV.',
            'file.mimes' => 'Le fichier doit être au format CSV.',
            'file.max' => 'Le fichier ne doit pas dépasser 5 Mo.',
        ]);

        $result = $importer->importFromCsv($request->file('file'));

        AuditLogger::log('products.imported', 'product_import', null, [
            'created' => $result['created'],
            'skipped' => $result['skipped'],
            'errors' => count($result['errors']),
        ]);

        if (MailRecipientService::isFeatureEnabled('import_completed')) {
            $mailable = new ProductImportCompletedMail(
                $result['created'],
                $result['skipped'],
                array_slice($result['errors'], 0, 20),
                $request->user()->name,
            );

            foreach (MailRecipientService::notificationRecipients() as $recipient) {
                try {
                    Mail::to($recipient)->send($mailable);
                } catch (\Throwable $exception) {
                    Log::warning('Import completion mail failed', [
                        'recipient' => $recipient,
                        'error' => $exception->getMessage(),
                    ]);
                }
            }
        }

        $message = "{$result['created']} produit(s) importé(s).";

        if ($result['skipped'] > 0) {
            $message .= " {$result['skipped']} ignoré(s) (doublons).";
        }

        if (count($result['errors']) > 0) {
            return redirect()
                ->route('admin.products.import')
                ->with('success', $message)
                ->with('import_errors', array_slice($result['errors'], 0, 20));
        }

        return redirect()
            ->route('admin.products.index')
            ->with('success', $message);
    }
}
