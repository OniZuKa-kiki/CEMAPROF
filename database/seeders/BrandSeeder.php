<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $names = collect(config('cemaprof.partner_brands', []))
            ->merge(
                Product::query()
                    ->whereNotNull('brand')
                    ->where('brand', '!=', '')
                    ->distinct()
                    ->pluck('brand')
            )
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->unique()
            ->sort()
            ->values();

        foreach ($names as $name) {
            Brand::firstOrCreate(['name' => $name]);
        }
    }
}
