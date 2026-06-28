<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Outillage & Matériel Industriel',
                'slug' => 'outillage-materiel-industriel',
                'description' => 'Outillage manuel, électroportatif et matériel pour l\'industrie, les ateliers et le BTP.',
                'image_url' => 'https://images.unsplash.com/photo-1504148455328-c376922d018c?w=800&q=80',
            ],
            [
                'name' => 'Matériel Agricole',
                'slug' => 'materiel-agricole',
                'description' => 'Équipements, consommables et matériel pour l\'agriculture et l\'élevage.',
                'image_url' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
            ],
            [
                'name' => 'Tuyauterie & Raccords',
                'slug' => 'tuyauterie-raccords',
                'description' => 'Tuyauterie divers, raccords, vannes et accessoires hydrauliques.',
                'image_url' => 'https://images.unsplash.com/photo-1581092918484-831393343c19?w=800&q=80',
            ],
            [
                'name' => 'Pompes & Motopompes',
                'slug' => 'pompes-motopompes',
                'description' => 'Pompes, motopompes et équipements de transfert pour l\'eau et les fluides.',
                'image_url' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
            ],
            [
                'name' => 'Protection Individuelle',
                'slug' => 'protection-individuelle',
                'description' => 'Équipements de protection individuelle (EPI) pour la sécurité au travail.',
                'image_url' => 'https://images.unsplash.com/photo-1582750433449-648ed127bbfe?w=800&q=80',
            ],
            [
                'name' => 'Quincaillerie & Droguerie',
                'slug' => 'quincaillerie-droguerie',
                'description' => 'Quincaillerie générale, droguerie, visserie, fixations et consommables.',
                'image_url' => 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80',
            ],
        ];

        $validSlugs = [];

        foreach ($categories as $category) {
            $validSlugs[] = $category['slug'];

            Category::updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'image_url' => $category['image_url'],
                    'is_active' => true,
                ]
            );
        }

        Category::query()
            ->whereNotIn('slug', $validSlugs)
            ->each(function (Category $category) {
                Product::query()->where('category_id', $category->id)->delete();
                $category->delete();
            });
    }
}
