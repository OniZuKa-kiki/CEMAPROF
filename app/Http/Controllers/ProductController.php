<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Services\CatalogCache;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only([
            'category_id',
            'search',
            'sort',
            'brand',
            'availability',
            'price_min',
            'price_max',
        ]);

        $query = Product::query()
            ->catalog()
            ->with('category');

        if ($request->filled('category_id')) {
            $categoryIds = is_array($request->category_id)
                ? $request->category_id
                : explode(',', $request->category_id);
            $query->whereIn('category_id', array_filter($categoryIds));
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->filled('availability')) {
            $query->where('availability', $request->availability);
        }

        if ($request->filled('search')) {
            $query->search($request->search, ['name', 'short_description', 'description']);
        }

        if ($request->filled('price_min')) {
            $query->where('price', '>=', (float) $request->price_min);
        }

        if ($request->filled('price_max')) {
            $query->where('price', '<=', (float) $request->price_max);
        }

        match ($request->input('sort', 'recent')) {
            'name' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            'popular' => $query->orderByRaw("CASE badge WHEN 'populaire' THEN 1 WHEN 'promo' THEN 2 WHEN 'nouveau' THEN 3 ELSE 4 END")
                ->orderBy('name'),
            'promo' => $query->orderByRaw("CASE badge WHEN 'promo' THEN 1 WHEN 'populaire' THEN 2 WHEN 'nouveau' THEN 3 ELSE 4 END")
                ->orderBy('name'),
            'nouveau' => $query->orderByRaw("CASE badge WHEN 'nouveau' THEN 1 WHEN 'populaire' THEN 2 WHEN 'promo' THEN 3 ELSE 4 END")
                ->orderByDesc('created_at'),
            'price_asc' => $query->orderByRaw('CASE WHEN price IS NULL THEN 1 ELSE 0 END')->orderBy('price')->orderBy('name'),
            'price_desc' => $query->orderByRaw('CASE WHEN price IS NULL THEN 1 ELSE 0 END')->orderByDesc('price')->orderBy('name'),
            default => $query->latest(),
        };

        $priceBounds = CatalogCache::remember('price_bounds', function () {
            $bounds = Product::query()
                ->catalog()
                ->whereNotNull('price')
                ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
                ->first();

            return [
                'min' => (float) ($bounds->min_price ?? 0),
                'max' => (float) ($bounds->max_price ?? 5000),
            ];
        });

        return Inertia::render('Products/Index', [
            'products' => $query->paginate(12)->withQueryString(),
            'categories' => CatalogCache::rememberArray('categories', fn () => Category::query()->catalog()->orderBy('name')->get()),
            'brands' => CatalogCache::rememberArray('brands', fn () => Product::query()
                ->catalog()
                ->whereNotNull('brand')
                ->distinct()
                ->orderBy('brand')
                ->pluck('brand')),
            'priceBounds' => $priceBounds,
            'filterCounts' => CatalogCache::remember('filter_counts', fn () => $this->catalogFilterCounts()),
            'filters' => $filters,
        ]);
    }

    private function catalogFilterCounts(): array
    {
        $base = Product::query()->catalog();

        return [
            'total' => (clone $base)->count(),
            'categories' => (clone $base)
                ->selectRaw('category_id, COUNT(*) as aggregate')
                ->groupBy('category_id')
                ->pluck('aggregate', 'category_id')
                ->map(fn ($count) => (int) $count)
                ->all(),
            'brands' => (clone $base)
                ->whereNotNull('brand')
                ->selectRaw('brand, COUNT(*) as aggregate')
                ->groupBy('brand')
                ->pluck('aggregate', 'brand')
                ->map(fn ($count) => (int) $count)
                ->all(),
            'availability' => (clone $base)
                ->selectRaw('availability, COUNT(*) as aggregate')
                ->groupBy('availability')
                ->pluck('aggregate', 'availability')
                ->map(fn ($count) => (int) $count)
                ->all(),
        ];
    }

    public function show(string $slug): Response
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->catalog()
            ->with('category')
            ->firstOrFail();

        $relatedProducts = Product::query()
            ->catalog()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('category')
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'canonicalUrl' => url("/produits/{$product->slug}"),
        ]);
    }

    public function suggest(Request $request)
    {
        $query = trim($request->string('q'));

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $products = Product::query()
            ->catalog()
            ->with('category:id,name,slug')
            ->search($query, ['name', 'short_description', 'description'])
            ->orderBy('name')
            ->limit(8)
            ->get(['id', 'name', 'slug', 'image_url', 'price', 'category_id']);

        return response()->json($products);
    }
}
