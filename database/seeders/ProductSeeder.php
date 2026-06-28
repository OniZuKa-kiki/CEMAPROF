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
                'category' => 'cuisine-professionnelle',
                'name' => 'Four Professionnel 10 Niveaux',
                'slug' => 'four-professionnel-10-niveaux',
                'short_description' => 'Four électrique inox 10 niveaux pour restauration collective.',
                'description' => 'Four professionnel en acier inoxydable avec 10 niveaux de cuisson, thermostat digital et porte vitrée. Idéal pour restaurants, boulangeries et traiteurs. Consommation optimisée et distribution homogène de la chaleur.',
                'image_url' => 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80',
                    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
                ],
                'badge' => 'populaire',
                'is_featured' => true,
            ],
            [
                'category' => 'cuisine-professionnelle',
                'name' => 'Plaque de Cuisson Induction 4 Feux',
                'slug' => 'plaque-cuisson-induction-4-feux',
                'short_description' => 'Plaque induction professionnelle haute performance 4 zones.',
                'description' => 'Plaque de cuisson à induction 4 feux avec commandes tactiles, timer intégré et sécurité enfant. Surface vitrocéramique résistante aux chocs thermiques.',
                'image_url' => 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
                'badge' => 'nouveau',
                'is_featured' => true,
            ],
            [
                'category' => 'cuisine-professionnelle',
                'name' => 'Robot Coupe-Légumes Pro',
                'slug' => 'robot-coupe-legumes-pro',
                'short_description' => 'Robot multifonction pour préparation rapide en cuisine pro.',
                'description' => 'Robot coupe-légumes professionnel avec 5 disques interchangeables. Moteur puissant 750W, bol inox 5L. Parfait pour la préparation en volume.',
                'image_url' => 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80',
                'badge' => 'promo',
                'is_featured' => false,
            ],
            [
                'category' => 'nettoyage-hygiene',
                'name' => 'Autolaveuse Industrielle',
                'slug' => 'autolaveuse-industrielle',
                'short_description' => 'Autolaveuse compacte pour sols industriels et commerciaux.',
                'description' => 'Autolaveuse professionnelle avec réservoir 30L, brosse rotative et aspiration intégrée. Idéale pour entrepôts, supermarchés et halls d\'accueil.',
                'image_url' => 'https://images.unsplash.com/photo-1585421514284-efb74c2b69c1?w=800&q=80',
                'badge' => 'populaire',
                'is_featured' => true,
            ],
            [
                'category' => 'nettoyage-hygiene',
                'name' => 'Chariot de Ménage Pro 120L',
                'slug' => 'chariot-menage-pro-120l',
                'short_description' => 'Chariot de ménage complet avec seaux et compartiments.',
                'description' => 'Chariot de ménage professionnel en plastique ABS avec 2 seaux 25L, presse-mop et rangements multiples. Roues pivotantes silencieuses.',
                'image_url' => 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80',
                'is_featured' => true,
            ],
            [
                'category' => 'nettoyage-hygiene',
                'name' => 'Distributeur Gel Hydroalcoolique',
                'slug' => 'distributeur-gel-hydroalcoolique',
                'short_description' => 'Distributeur automatique sans contact 1L.',
                'description' => 'Distributeur automatique de gel hydroalcoolique avec détection infrarouge. Capacité 1L, alimentation sur pile ou secteur.',
                'image_url' => 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=800&q=80',
                'badge' => 'nouveau',
                'is_featured' => false,
            ],
            [
                'category' => 'hotellerie-restauration',
                'name' => 'Chariot Room Service Inox',
                'slug' => 'chariot-room-service-inox',
                'short_description' => 'Chariot de service chambre avec réchauffeur intégré.',
                'description' => 'Chariot room service en inox avec plateaux réchauffants, compartiment réfrigéré et roulettes freinées. Design élégant pour hôtels 4 et 5 étoiles.',
                'image_url' => 'https://images.unsplash.com/photo-1564501049412-61c3a474379e?w=800&q=80',
                'badge' => 'populaire',
                'is_featured' => true,
            ],
            [
                'category' => 'hotellerie-restauration',
                'name' => 'Set Vaisselle Porcelaine 48 pcs',
                'slug' => 'set-vaisselle-porcelaine-48-pcs',
                'short_description' => 'Service de table porcelaine blanche pour restaurant.',
                'description' => 'Set complet de vaisselle en porcelaine blanche : 12 assiettes plates, 12 creuses, 12 dessert et 12 bols. Résistant au lave-vaisselle professionnel.',
                'image_url' => 'https://images.unsplash.com/photo-1603199506016-b9a594b0c424?w=800&q=80',
                'is_featured' => true,
            ],
            [
                'category' => 'bureau-fournitures',
                'name' => 'Armoire Archive Métallique',
                'slug' => 'armoire-archive-metallique',
                'short_description' => 'Armoire de rangement 4 portes avec serrure.',
                'description' => 'Armoire métallique de bureau avec 4 étagères réglables, serrure à clé et finition anti-corrosion. Dimensions : 180x90x40 cm.',
                'image_url' => 'https://images.unsplash.com/photo-1595428774223-ef52624120e2?w=800&q=80',
                'badge' => 'promo',
                'is_featured' => true,
            ],
            [
                'category' => 'bureau-fournitures',
                'name' => 'Destructeur Documents Pro',
                'slug' => 'destructeur-documents-pro',
                'short_description' => 'Destructeur de documents sécurité niveau P-4.',
                'description' => 'Destructeur de documents professionnel coupe croisée, capacité 20 feuilles, corbeille 30L. Niveau de sécurité P-4 pour documents confidentiels.',
                'image_url' => 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
                'is_featured' => false,
            ],
            [
                'category' => 'outillage-professionnel',
                'name' => 'Perceuse Visseuse Sans Fil 18V',
                'slug' => 'perceuse-visseuse-sans-fil-18v',
                'short_description' => 'Perceuse-visseuse pro 18V avec 2 batteries.',
                'description' => 'Perceuse-visseuse sans fil 18V avec mandrin métal 13mm, 2 batteries lithium 2Ah et chargeur rapide. Couple max 60 Nm.',
                'image_url' => 'https://images.unsplash.com/photo-1504148455328-c376922d018c?w=800&q=80',
                'badge' => 'populaire',
                'is_featured' => true,
            ],
            [
                'category' => 'outillage-professionnel',
                'name' => 'Coffret Outillage 120 pièces',
                'slug' => 'coffret-outillage-120-pieces',
                'short_description' => 'Coffret complet clés, douilles et accessoires.',
                'description' => 'Coffret d\'outillage professionnel 120 pièces en chrome vanadium. Clés mixtes, douilles, tournevis et accessoires dans mallette rigide.',
                'image_url' => 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80',
                'badge' => 'nouveau',
                'is_featured' => false,
            ],
            [
                'category' => 'outillage-professionnel',
                'name' => 'Niveau Laser Rotatif',
                'slug' => 'niveau-laser-rotatif',
                'short_description' => 'Niveau laser rotatif 360° pour chantiers.',
                'description' => 'Niveau laser rotatif professionnel portée 500m, précision ±1.5mm/10m. Trépied et lunettes de visée inclus.',
                'image_url' => 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
                'is_featured' => true,
            ],
            [
                'category' => 'mobilier-professionnel',
                'name' => 'Bureau Direction Ergonomique',
                'slug' => 'bureau-direction-ergonomique',
                'short_description' => 'Bureau direction en bois avec retour et rangements.',
                'description' => 'Bureau de direction ergonomique avec plateau bois massif, retour et 3 tiroirs verrouillables. Dimensions 180x90 cm.',
                'image_url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
                'badge' => 'populaire',
                'is_featured' => true,
            ],
            [
                'category' => 'mobilier-professionnel',
                'name' => 'Chaise Bureau Ergonomique Mesh',
                'slug' => 'chaise-bureau-ergonomique-mesh',
                'short_description' => 'Fauteuil de bureau mesh avec support lombaire.',
                'description' => 'Chaise de bureau ergonomique avec dossier mesh respirant, accoudoirs réglables, support lombaire et base 5 roues. Charge max 150kg.',
                'image_url' => 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
                'badge' => 'promo',
                'is_featured' => false,
            ],
            [
                'category' => 'mobilier-professionnel',
                'name' => 'Rayonnage Métallique 5 Niveaux',
                'slug' => 'rayonnage-metallique-5-niveaux',
                'short_description' => 'Rayonnage industriel charge lourde 250kg/niveau.',
                'description' => 'Rayonnage métallique 5 niveaux avec charge max 250kg par niveau. Montage sans outils, finition galvanisée anti-corrosion.',
                'image_url' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
                'is_featured' => true,
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
                    'image_url' => $data['image_url'],
                    'images' => $data['images'] ?? null,
                    'badge' => $data['badge'] ?? null,
                    'is_featured' => $data['is_featured'],
                    'is_active' => true,
                ]
            );
        }
    }
}
