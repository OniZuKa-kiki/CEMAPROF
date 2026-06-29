<?php

namespace App\Http\Middleware;

use App\Models\ContactMessage;
use App\Models\SiteSetting;
use App\Services\CatalogCache;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $settings = rescue(fn () => SiteSetting::allCached(), [], false);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'import_errors' => fn () => $request->session()->get('import_errors'),
            ],
            'siteSettings' => $settings,
            'whatsappNumber' => $settings['whatsapp'] ?? config('cemaprof.whatsapp'),
            'company' => $this->resolvedCompany($settings),
            'appUrl' => config('app.url'),
            'navCategories' => rescue(
                fn () => CatalogCache::rememberArray('nav_categories', fn () => \App\Models\Category::query()
                    ->catalog()
                    ->orderBy('name')
                    ->limit(6)
                    ->get(['id', 'name', 'slug'])),
                [],
                false
            ),
            'admin' => [
                'unreadMessages' => $user?->isAdmin()
                    ? ContactMessage::where('is_read', false)->count()
                    : 0,
            ],
        ];
    }

    private function resolvedCompany(array $settings): array
    {
        $defaults = config('cemaprof.company', []);
        $activityLines = $defaults['activity_lines'] ?? [];

        if (! empty($settings['activity_lines'])) {
            $parsed = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $settings['activity_lines']))));
            if ($parsed !== []) {
                $activityLines = $parsed;
            }
        }

        return array_merge($defaults, [
            'tagline' => $settings['site_tagline'] ?? ($defaults['tagline'] ?? ''),
            'description' => $settings['company_description'] ?? ($defaults['description'] ?? ''),
            'maps_url' => $settings['google_maps_url'] ?? ($defaults['maps_url'] ?? ''),
            'activity_lines' => $activityLines,
        ]);
    }
}
