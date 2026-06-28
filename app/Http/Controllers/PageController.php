<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('About/Index', [
            'stats' => [
                ['label' => 'Produits', 'value' => 500, 'suffix' => '+'],
                ['label' => "Ans d'expérience", 'value' => 10, 'suffix' => '+'],
                ['label' => 'Clients', 'value' => 1000, 'suffix' => '+'],
                ['label' => 'Marques', 'value' => 50, 'suffix' => '+'],
            ],
        ]);
    }
}
