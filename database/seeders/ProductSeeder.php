<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'category' => 'outillage-materiel-industriel',
                'name' => 'Perceuse Visseuse Sans Fil 18V',
                'slug' => 'perceuse-visseuse-sans-fil-18v',
                'short_description' => 'Perceuse-visseuse professionnelle 18V avec 2 batteries.',
                'description' => 'Perceuse-visseuse sans fil 18V, mandrin métal 13 mm, 2 batteries lithium et chargeur rapide. Adaptée aux ateliers, maintenance industrielle et chantiers.',
                'image_url' => 'https://images.unsplash.com/photo-1504148455328-c376922d018c?w=800&q=80',
                'badge' => 'populaire',
                'is_featured' => true,
                'price' => 1890,
            ],
            [
                'category' => 'outillage-materiel-industriel',
                'name' => 'Coffret Outillage 120 pièces',
                'slug' => 'coffret-outillage-120-pieces',
                'short_description' => 'Coffret clés, douilles et accessoires professionnels.',
                'description' => 'Coffret d\'outillage 120 pièces en chrome vanadium. Clés mixtes, douilles, tournevis et accessoires dans mallette rigide.',
                'image_url' => 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80',
                'badge' => 'nouveau',
                'is_featured' => true,
                'price' => 2450,
            ],
            [
                'category' => 'outillage-materiel-industriel',
                'name' => 'Meuleuse d\'Angle 230 mm',
                'slug' => 'meuleuse-angle-230mm',
                'short_description' => 'Meuleuse professionnelle pour découpe et meulage.',
                'description' => 'Meuleuse d\'angle 230 mm, poignée auxiliaire, capot de protection et démarrage progressif. Usage intensif sur chantier et en atelier.',
                'image_url' => 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
                'is_featured' => false,
                'price' => 1280,
            ],
            [
                'category' => 'materiel-agricole',
                'name' => 'Pulvérisateur Agricole 16L',
                'slug' => 'pulverisateur-agricole-16l',
                'short_description' => 'Pulvérisateur à dos pour traitements agricoles.',
                'description' => 'Pulvérisateur agricole 16 litres avec lance télescopique, bretelles renforcées et pression réglable. Idéal pour vergers, cultures et jardins professionnels.',
                'image_url' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
                'badge' => 'populaire',
                'is_featured' => true,
                'price' => 890,
            ],
            [
                'category' => 'materiel-agricole',
                'name' => 'Tuyau d\'Arrosage Renforcé 50m',
                'slug' => 'tuyau-arrosage-renforce-50m',
                'short_description' => 'Tuyau agricole haute résistance 50 mètres.',
                'description' => 'Tuyau d\'arrosage renforcé 3/4", longueur 50 m, résistant aux UV et à la pression. Raccords laiton inclus.',
                'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a048049b?w=800&q=80',
                'is_featured' => false,
                'price' => 650,
            ],
            [
                'category' => 'tuyauterie-raccords',
                'name' => 'Lot Raccords PVC Pression 32mm',
                'slug' => 'lot-raccords-pvc-pression-32mm',
                'short_description' => 'Coude, té, manchon et réduction PVC 32 mm.',
                'description' => 'Ensemble de raccords PVC pression 32 mm pour réseaux d\'eau et irrigation. Coude 90°, té, manchon et bouchon.',
                'image_url' => 'https://images.unsplash.com/photo-1581092918484-831393343c19?w=800&q=80',
                'badge' => 'promo',
                'is_featured' => true,
                'price' => 420,
            ],
            [
                'category' => 'tuyauterie-raccords',
                'name' => 'Vanne à Boisseau Sphérique 1"',
                'slug' => 'vanne-boisseau-spherique-1-pouce',
                'short_description' => 'Vanne laiton 1 pouce pour conduites industrielles.',
                'description' => 'Vanne à boisseau sphérique laiton 1", poignée papillon, étanchéité renforcée. Usage fluides, eau et air comprimé.',
                'image_url' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd09a?w=800&q=80',
                'is_featured' => false,
                'price' => 185,
            ],
            [
                'category' => 'pompes-motopompes',
                'name' => 'Motopompe Essence 2"',
                'slug' => 'motopompe-essence-2-pouces',
                'short_description' => 'Motopompe portable pour eau claire et irrigation.',
                'description' => 'Motopompe à essence 2 pouces, débit élevé, idéale pour irrigation, vidange et transfert d\'eau. Moteur 4 temps, démarrage manuel.',
                'image_url' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
                'badge' => 'populaire',
                'is_featured' => true,
                'price' => 3200,
            ],
            [
                'category' => 'pompes-motopompes',
                'name' => 'Pompe de Surface 1CV',
                'slug' => 'pompe-surface-1cv',
                'short_description' => 'Pompe de surface électrique pour puits et réservoirs.',
                'description' => 'Pompe de surface 1 CV, corps fonte, aspiration et refoulement renforcés. Adaptée aux puits, citernes et réseaux agricoles.',
                'image_url' => 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
                'badge' => 'nouveau',
                'is_featured' => true,
                'price' => 2750,
            ],
            [
                'category' => 'protection-individuelle',
                'name' => 'Casque de Sécurité + Lunettes',
                'slug' => 'casque-securite-lunettes',
                'short_description' => 'Ensemble EPI tête et yeux pour chantier.',
                'description' => 'Casque de sécurité conforme EN397 avec jugulaire, lunettes anti-impact et anti-buée. Couleur jaune haute visibilité.',
                'image_url' => 'https://images.unsplash.com/photo-1582750433449-648ed127bbfe?w=800&q=80',
                'badge' => 'populaire',
                'is_featured' => true,
                'price' => 145,
            ],
            [
                'category' => 'protection-individuelle',
                'name' => 'Gants de Travail Cuir Renforcé',
                'slug' => 'gants-travail-cuir-renforce',
                'short_description' => 'Gants professionnels pour manutention et soudure.',
                'description' => 'Gants en cuir renforcé, paume anti-abrasion, poignet élastiqué. Protection pour atelier, BTP et industrie.',
                'image_url' => 'https://images.unsplash.com/photo-1612198188060-c7c2a39327a2?w=800&q=80',
                'is_featured' => false,
                'price' => 85,
            ],
            [
                'category' => 'quincaillerie-droguerie',
                'name' => 'Lot Vis & Cheville Professionnel',
                'slug' => 'lot-vis-cheville-professionnel',
                'short_description' => 'Assortiment visserie pour fixation béton et maçonnerie.',
                'description' => 'Coffret vis, chevilles et rondelles pour fixation professionnelle. Boîte compartimentée, usage chantier et atelier.',
                'image_url' => 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80',
                'badge' => 'promo',
                'is_featured' => true,
                'price' => 320,
            ],
            [
                'category' => 'quincaillerie-droguerie',
                'name' => 'Silicone & Mastic Pro 12 cartouches',
                'slug' => 'silicone-mastic-pro-12',
                'short_description' => 'Pack consommables étanchéité et finition.',
                'description' => 'Lot de 12 cartouches silicone et mastic polyuréthane pour joints, étanchéité et finitions. Usage bâtiment et industrie.',
                'image_url' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
                'is_featured' => false,
                'price' => 540,
            ],
        ];

        foreach ($products as $data) {
            $category = Category::where('slug', $data['category'])->first();

            if (! $category) {
                continue;
            }

            Product::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'category_id' => $category->id,
                    'name' => $data['name'],
                    'short_description' => $data['short_description'],
                    'description' => $data['description'],
                    'price' => $data['price'] ?? null,
                    'image_url' => $data['image_url'],
                    'images' => $data['images'] ?? null,
                    'badge' => $data['badge'] ?? null,
                    'is_featured' => $data['is_featured'],
                    'is_active' => true,
                ]
            );
        }

        $validSlugs = collect($products)->pluck('slug')->all();
        Product::query()
            ->whereNotIn('slug', $validSlugs)
            ->delete();
    }
}
