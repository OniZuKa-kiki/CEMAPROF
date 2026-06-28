<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Cuisine Professionnelle',
                'slug' => 'cuisine-professionnelle',
                'description' => 'Équipements et ustensiles pour cuisines professionnelles, restaurants et traiteurs.',
                'image_url' => 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
            ],
            [
                'name' => 'Nettoyage & Hygiène',
                'slug' => 'nettoyage-hygiene',
                'description' => 'Produits et matériel de nettoyage pour entreprises et collectivités.',
                'image_url' => 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
            ],
            [
                'name' => 'Hôtellerie & Restauration',
                'slug' => 'hotellerie-restauration',
                'description' => 'Mobilier, linge et équipements pour hôtels, riads et établissements HORECA.',
                'image_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
            ],
            [
                'name' => 'Bureau & Fournitures',
                'slug' => 'bureau-fournitures',
                'description' => 'Fournitures de bureau, papeterie et consommables pour entreprises.',
                'image_url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
            ],
            [
                'name' => 'Outillage Professionnel',
                'slug' => 'outillage-professionnel',
                'description' => 'Outillage manuel et électroportatif pour artisans et professionnels du BTP.',
                'image_url' => 'https://images.unsplash.com/photo-1504148455328-c376922d018c?w=800&q=80',
            ],
            [
                'name' => 'Mobilier Professionnel',
                'slug' => 'mobilier-professionnel',
                'description' => 'Mobilier de bureau, rangement et aménagement d\'espaces professionnels.',
                'image_url' => 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
            ],
        ];

        foreach ($categories as $category) {
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
    }
}
