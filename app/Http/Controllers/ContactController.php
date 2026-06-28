<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Models\ContactMessage;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $slugs = $this->resolveProductSlugs($request);
        $quantities = $this->resolveProductQuantities($request);
        $quoteProducts = $this->loadQuoteProducts($slugs, $quantities);

        return Inertia::render('Contact/Index', [
            'product' => $quoteProducts[0] ?? null,
            'prefilledProduct' => $quoteProducts[0]['slug'] ?? $request->query('product'),
            'quoteProducts' => $quoteProducts,
            'prefilledSubject' => $request->query('subject'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if ($request->filled('website')) {
            return redirect()
                ->back()
                ->with('success', 'Message envoyé ! Nous vous répondrons sous 24h.');
        }

        $validated = $request->validate((new ContactRequest)->rules(), (new ContactRequest)->messages());

        $productSlugs = array_values(array_filter($validated['product_slugs'] ?? []));

        if (empty($productSlugs) && ! empty($validated['product_slug'])) {
            $productSlugs = array_filter(array_map('trim', explode(',', $validated['product_slug'])));
        }

        $validated['product_slugs'] = ! empty($productSlugs) ? $productSlugs : null;
        $validated['product_slug'] = $productSlugs[0] ?? ($validated['product_slug'] ?? null);

        $contactMessage = ContactMessage::create($validated);

        \App\Services\ContactMailService::sendForMessage($contactMessage);

        return redirect()
            ->back()
            ->with('success', 'Message envoyé ! Nous vous répondrons sous 24h.');
    }

    private function resolveProductSlugs(Request $request): array
    {
        if ($request->filled('products')) {
            return array_values(array_filter(array_map(function (string $part) {
                $part = trim($part);

                return explode(':', $part)[0];
            }, explode(',', $request->string('products')))));
        }

        if ($request->filled('product')) {
            return [$request->string('product')];
        }

        return [];
    }

    private function resolveProductQuantities(Request $request): array
    {
        if (! $request->filled('products')) {
            return [];
        }

        $quantities = [];

        foreach (explode(',', $request->string('products')) as $part) {
            $part = trim($part);

            if (! str_contains($part, ':')) {
                continue;
            }

            [$slug, $quantity] = explode(':', $part, 2);
            $slug = trim($slug);

            if ($slug !== '') {
                $quantities[$slug] = max(1, (int) $quantity);
            }
        }

        return $quantities;
    }

    private function loadQuoteProducts(array $slugs, array $quantities = []): array
    {
        if (empty($slugs)) {
            return [];
        }

        return Product::query()
            ->whereIn('slug', $slugs)
            ->where('is_active', true)
            ->get(['slug', 'name', 'price'])
            ->sortBy(fn ($product) => array_search($product->slug, $slugs, true))
            ->values()
            ->map(fn ($product) => [
                'slug' => $product->slug,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantities[$product->slug] ?? 1,
            ])
            ->all();
    }
}
