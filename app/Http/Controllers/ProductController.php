<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['category_id', 'badge', 'search', 'sort']);

        $query = Product::query()
            ->catalog()
            ->with('category');

        if ($request->filled('category_id')) {
            $categoryIds = is_array($request->category_id)
                ? $request->category_id
                : explode(',', $request->category_id);
            $query->whereIn('category_id', array_filter($categoryIds));
        }

        if ($request->filled('badge')) {
            $query->where('badge', $request->badge);
        }

        if ($request->filled('search')) {
            $query->search($request->search, ['name', 'short_description', 'description']);
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

        return Inertia::render('Products/Index', [
            'products' => $query->paginate(12)->withQueryString(),
            'categories' => Category::query()->catalog()->orderBy('name')->get(),
            'filters' => $filters,
        ]);
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
