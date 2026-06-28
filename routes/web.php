<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/produits', [ProductController::class, 'index'])->name('products');
Route::get('/produits/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/categories/{slug}', [CategoryController::class, 'show'])->name('categories.show');
Route::get('/a-propos', [PageController::class, 'about'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:contact')
    ->name('contact.store');

Route::get('/sitemap.xml', function () {
    $urls = [
        ['loc' => url('/'), 'priority' => '1.0'],
        ['loc' => url('/produits'), 'priority' => '0.9'],
        ['loc' => url('/a-propos'), 'priority' => '0.7'],
        ['loc' => url('/contact'), 'priority' => '0.8'],
    ];

    foreach (\App\Models\Category::where('is_active', true)->get() as $category) {
        $urls[] = ['loc' => url("/categories/{$category->slug}"), 'priority' => '0.8'];
    }

    foreach (\App\Models\Product::where('is_active', true)->get() as $product) {
        $urls[] = ['loc' => url("/produits/{$product->slug}"), 'priority' => '0.7'];
    }

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    foreach ($urls as $url) {
        $xml .= '<url>';
        $xml .= '<loc>'.htmlspecialchars($url['loc']).'</loc>';
        $xml .= '<priority>'.$url['priority'].'</priority>';
        $xml .= '</url>';
    }

    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'application/xml');
})->name('sitemap');

Route::fallback(function () {
    return Inertia::render('Errors/NotFound')
        ->toResponse(request())
        ->setStatusCode(404);
});

require __DIR__.'/auth.php';
