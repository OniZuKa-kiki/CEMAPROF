<?php

namespace App\Providers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Observers\CatalogCacheObserver;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        App::setLocale((string) config('app.locale', 'fr'));

        Vite::prefetch(concurrency: 3);

        Password::defaults(fn () => Password::min(10)->letters()->mixedCase()->numbers());

        Product::observe(CatalogCacheObserver::class);
        Category::observe(CatalogCacheObserver::class);
        Brand::observe(CatalogCacheObserver::class);

        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        RateLimiter::for('admin-login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        RateLimiter::for('contact', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('password-reset', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });

        RateLimiter::for('search-suggest', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });
    }
}
