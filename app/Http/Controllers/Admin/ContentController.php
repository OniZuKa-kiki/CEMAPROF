<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\AuditLogger;
use App\Services\ImageUploadService;
use App\Services\SiteContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function faq(): Response
    {
        return Inertia::render('Admin/Content/Faq', [
            'items' => SiteContent::faqItems(),
        ]);
    }

    public function updateFaq(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.icon' => ['required', 'string', 'max:40'],
            'items.*.q' => ['required', 'string', 'max:500'],
            'items.*.a' => ['required', 'string', 'max:3000'],
        ], [
            'items.required' => 'Ajoutez au moins une question.',
            'items.min' => 'Ajoutez au moins une question.',
            'items.*.q.required' => 'Chaque question doit avoir un intitulé.',
            'items.*.a.required' => 'Chaque question doit avoir une réponse.',
        ]);

        SiteSetting::updateOrCreate(
            ['key' => 'faq_items'],
            ['value' => json_encode($validated['items'], JSON_UNESCAPED_UNICODE)],
        );
        SiteSetting::clearCache();

        AuditLogger::log('content.faq.updated', 'settings', null, [
            'count' => count($validated['items']),
        ]);

        return back()->with('success', 'FAQ mise à jour avec succès.');
    }

    public function cgv(): Response
    {
        return Inertia::render('Admin/Content/Cgv', [
            'sections' => SiteContent::cgvSections(),
        ]);
    }

    public function updateCgv(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sections' => ['required', 'array', 'min:1'],
            'sections.*.title' => ['required', 'string', 'max:255'],
            'sections.*.content' => ['required', 'string', 'max:5000'],
        ], [
            'sections.required' => 'Ajoutez au moins une section.',
            'sections.min' => 'Ajoutez au moins une section.',
            'sections.*.title.required' => 'Chaque section doit avoir un titre.',
            'sections.*.content.required' => 'Chaque section doit avoir un contenu.',
        ]);

        SiteSetting::updateOrCreate(
            ['key' => 'cgv_sections'],
            ['value' => json_encode($validated['sections'], JSON_UNESCAPED_UNICODE)],
        );
        SiteSetting::clearCache();

        AuditLogger::log('content.cgv.updated', 'settings', null, [
            'count' => count($validated['sections']),
        ]);

        return back()->with('success', 'CGV mises à jour avec succès.');
    }

    public function partnerBrands(): Response
    {
        return Inertia::render('Admin/Content/PartnerBrands', [
            'catalog' => SiteContent::partnerBrandCatalog(),
            'activeSlugs' => SiteContent::partnerBrandSlugs(),
        ]);
    }

    public function storePartnerBrand(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'logo' => ['required', 'image', 'mimes:png', 'max:2048'],
            'scale' => ['nullable', 'numeric', 'min:0.5', 'max:4'],
        ], [
            'name.required' => 'Le nom de la marque est obligatoire.',
            'logo.required' => 'Le logo PNG est obligatoire.',
            'logo.mimes' => 'Le logo doit être au format PNG.',
            'logo.max' => 'Le logo ne peut pas dépasser 2 Mo.',
        ]);

        $slug = Str::slug($validated['name']);
        if ($slug === '') {
            return back()->withErrors(['name' => 'Nom de marque invalide.']);
        }

        $catalog = SiteContent::partnerBrandCatalog();
        if (collect($catalog)->contains(fn (array $brand) => $brand['slug'] === $slug)) {
            return back()->withErrors(['name' => 'Cette marque existe déjà dans le catalogue.']);
        }

        $url = ImageUploadService::store($request->file('logo'), 'partner-logos');
        $catalog[] = [
            'name' => $validated['name'],
            'slug' => $slug,
            'file' => basename(parse_url($url, PHP_URL_PATH) ?? ''),
            'url' => $url,
            'scale' => (float) ($validated['scale'] ?? 1),
            'custom' => true,
        ];

        SiteContent::savePartnerBrandCatalog($catalog);

        AuditLogger::log('content.partner_brand.created', 'settings', null, [
            'slug' => $slug,
            'name' => $validated['name'],
        ]);

        return back()->with('success', 'Marque ajoutée au catalogue.');
    }

    public function destroyPartnerBrand(string $slug): RedirectResponse
    {
        $catalog = SiteContent::partnerBrandCatalog();
        $brand = collect($catalog)->firstWhere('slug', $slug);

        if (! $brand) {
            return back()->withErrors(['brand' => 'Marque introuvable.']);
        }

        if (($brand['custom'] ?? false) && ! empty($brand['url'])) {
            ImageUploadService::deleteIfLocal($brand['url']);
        }

        $nextCatalog = array_values(array_filter(
            $catalog,
            fn (array $item) => $item['slug'] !== $slug,
        ));

        SiteContent::savePartnerBrandCatalog($nextCatalog);

        $nextSlugs = array_values(array_filter(
            SiteContent::partnerBrandSlugs(),
            fn (string $activeSlug) => $activeSlug !== $slug,
        ));
        SiteContent::savePartnerBrandSlugs($nextSlugs);

        AuditLogger::log('content.partner_brand.deleted', 'settings', null, [
            'slug' => $slug,
            'name' => $brand['name'] ?? $slug,
        ]);

        return back()->with('success', 'Marque supprimée du catalogue.');
    }

    public function updatePartnerBrands(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'slugs' => ['required', 'array'],
            'slugs.*' => ['string', 'max:80'],
        ]);

        $allowed = collect(SiteContent::partnerBrandCatalog())->pluck('slug')->all();
        $slugs = array_values(array_filter(
            $validated['slugs'],
            fn (string $slug) => in_array($slug, $allowed, true),
        ));

        SiteContent::savePartnerBrandSlugs($slugs);

        AuditLogger::log('content.partner_brands.updated', 'settings', null, [
            'count' => count($slugs),
        ]);

        return back()->with('success', 'Marques partenaires mises à jour.');
    }
}
