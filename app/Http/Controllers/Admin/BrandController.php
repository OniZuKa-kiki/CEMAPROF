<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Product;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        $brands = Brand::query()
            ->orderBy('name')
            ->get()
            ->map(fn (Brand $brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
                'products_count' => Product::where('brand', $brand->name)->count(),
            ]);

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80', 'unique:brands,name'],
        ], [
            'name.required' => 'Le nom de la marque est obligatoire.',
            'name.unique' => 'Cette marque existe déjà.',
            'name.max' => 'Le nom ne peut pas dépasser 80 caractères.',
        ]);

        $brand = Brand::create(['name' => trim($validated['name'])]);

        AuditLogger::log('brand.created', 'brand', $brand->id, [
            'name' => $brand->name,
        ]);

        return back()->with('success', 'Marque ajoutée avec succès.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        $productsCount = Product::where('brand', $brand->name)->count();

        if ($productsCount > 0) {
            return back()->with('error', "Impossible de supprimer « {$brand->name} » : {$productsCount} produit(s) l'utilisent encore.");
        }

        AuditLogger::log('brand.deleted', 'brand', $brand->id, [
            'name' => $brand->name,
        ]);

        $brand->delete();

        return back()->with('success', 'Marque supprimée.');
    }
}
