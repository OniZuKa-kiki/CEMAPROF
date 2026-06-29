<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Services\AuditLogger;
use App\Services\ImageUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()->with('category');

        if ($request->filled('search')) {
            $query->search($request->search, ['name', 'slug', 'short_description']);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('badge')) {
            $query->where('badge', $request->badge);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $sort = $request->input('sort', 'recent');
        match ($sort) {
            'name' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            default => $query->latest(),
        };

        $perPage = min(max((int) $request->input('per_page', 25), 10), 100);

        return Inertia::render('Admin/Products/Index', [
            'products' => $query->paginate($perPage)->withQueryString(),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'category_id', 'badge', 'status', 'sort', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => null,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'brandOptions' => Brand::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        $data = $this->prepareData($request);

        if ($request->hasFile('image')) {
            $data['image_url'] = ImageUploadService::store($request->file('image'), 'products');
        }

        if ($request->hasFile('gallery')) {
            $data['images'] = ImageUploadService::storeMany($request->file('gallery'), 'products/gallery');
        }

        $product = Product::create($data);
        $this->syncBrandRegistry($data['brand'] ?? null);

        AuditLogger::log('product.created', 'product', $product->id, [
            'name' => $product->name,
            'slug' => $product->slug,
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Produit créé avec succès.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => $product->load('category'),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'brandOptions' => Brand::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $data = $this->prepareData($request);

        if ($request->hasFile('image')) {
            ImageUploadService::deleteIfLocal($product->image_url);
            $data['image_url'] = ImageUploadService::store($request->file('image'), 'products');
        }

        $images = $product->images ?? [];

        if ($request->filled('remove_gallery')) {
            foreach ($request->remove_gallery as $url) {
                ImageUploadService::deleteIfLocal($url);
                $images = array_values(array_filter($images, fn ($img) => $img !== $url));
            }
        }

        if ($request->hasFile('gallery')) {
            $images = array_merge($images, ImageUploadService::storeMany($request->file('gallery'), 'products/gallery'));
        }

        $data['images'] = $images ?: null;

        $product->update($data);
        $this->syncBrandRegistry($data['brand'] ?? null);

        AuditLogger::log('product.updated', 'product', $product->id, [
            'name' => $product->name,
            'slug' => $product->slug,
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Produit mis à jour avec succès.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        ImageUploadService::deleteIfLocal($product->image_url);
        foreach ($product->images ?? [] as $image) {
            ImageUploadService::deleteIfLocal($image);
        }

        AuditLogger::log('product.deleted', 'product', $product->id, [
            'name' => $product->name,
            'slug' => $product->slug,
        ]);

        $product->delete();

        return back()->with('success', 'Produit supprimé.');
    }

    public function toggleActive(Product $product): RedirectResponse
    {
        $product->update(['is_active' => ! $product->is_active]);

        AuditLogger::log('product.toggle_active', 'product', $product->id, [
            'is_active' => $product->is_active,
        ]);

        return back();
    }

    public function toggleFeatured(Product $product): RedirectResponse
    {
        $product->update(['is_featured' => ! $product->is_featured]);

        AuditLogger::log('product.toggle_featured', 'product', $product->id, [
            'is_featured' => $product->is_featured,
        ]);

        return back();
    }

    private function prepareData(ProductRequest $request): array
    {
        return [
            'name' => $request->name,
            'slug' => Str::slug($request->slug),
            'category_id' => $request->category_id,
            'short_description' => $request->short_description,
            'description' => $request->description,
            'price' => $request->filled('price') ? $request->price : null,
            'brand' => $request->brand ?: null,
            'availability' => $request->availability ?: 'in_stock',
            'badge' => $request->badge ?: null,
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => $request->boolean('is_active', true),
        ];
    }

    private function syncBrandRegistry(?string $brand): void
    {
        $name = trim((string) $brand);

        if ($name === '') {
            return;
        }

        Brand::firstOrCreate(['name' => $name]);
    }
}
