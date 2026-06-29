<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Services\CatalogCache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home/Index', [
            'featuredProducts' => CatalogCache::rememberArray('home_featured', fn () => Product::query()
                ->catalog()
                ->where('is_featured', true)
                ->with('category')
                ->latest()
                ->limit(8)
                ->get()),
            'categories' => CatalogCache::rememberArray('home_categories', fn () => Category::query()
                ->catalog()
                ->whereHas('products', fn ($q) => $q->where('is_active', true))
                ->withCount(['products' => fn ($q) => $q->where('is_active', true)])
                ->orderBy('name')
                ->get()),
            'stats' => [
                ['label' => 'Produits', 'value' => 500, 'suffix' => '+'],
                ['label' => "Ans d'expérience", 'value' => 10, 'suffix' => '+'],
                ['label' => 'Clients', 'value' => 1000, 'suffix' => '+'],
                ['label' => 'Marques', 'value' => 50, 'suffix' => '+'],
            ],
        ]);
    }
}
