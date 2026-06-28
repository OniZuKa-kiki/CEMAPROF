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
            ->where('is_active', true)
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
            default => $query->latest(),
        };

        return Inertia::render('Products/Index', [
            'products' => $query->paginate(12)->withQueryString(),
            'categories' => Category::query()->where('is_active', true)->get(),
            'filters' => $filters,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with('category')
            ->firstOrFail();

        $relatedProducts = Product::query()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->with('category')
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
