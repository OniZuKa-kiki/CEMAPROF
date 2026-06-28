<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_products' => Product::count(),
                'active_products' => Product::where('is_active', true)->count(),
                'unread_messages' => ContactMessage::where('is_read', false)->count(),
                'active_categories' => Category::where('is_active', true)->count(),
            ],
            'recentMessages' => ContactMessage::latest()->limit(5)->get(),
            'recentProducts' => Product::with('category')->latest()->limit(5)->get(),
        ]);
    }
}
