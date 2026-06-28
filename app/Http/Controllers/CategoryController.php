<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function show(string $slug): Response
    {
        $category = Category::query()
            ->where('slug', $slug)
            ->catalog()
            ->firstOrFail();

        $products = Product::query()
            ->catalog()
            ->where('category_id', $category->id)
            ->with('category')
            ->latest()
            ->paginate(12);

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'products' => $products,
        ]);
    }
}
