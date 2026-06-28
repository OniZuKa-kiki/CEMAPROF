<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
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
            'siteSettings' => rescue(fn () => SiteSetting::allCached(), [], false),
            'whatsappNumber' => rescue(fn () => SiteSetting::get('whatsapp') ?? config('cemaprof.whatsapp'), config('cemaprof.whatsapp'), false),
            'company' => config('cemaprof.company'),
            'navCategories' => rescue(
                fn () => Category::query()
                    ->catalog()
                    ->orderBy('name')
                    ->limit(6)
                    ->get(['id', 'name', 'slug']),
                collect(),
                false
            ),
            'admin' => [
                'unreadMessages' => $user?->isAdmin()
                    ? ContactMessage::where('is_read', false)->count()
                    : 0,
            ],
        ];
    }
}
