# CEMAPROF — La Centrale du Matériel Professionnel

Site vitrine e-commerce pour **CEMAPROF**, entreprise marocaine de vente de matériel professionnel (droguerie pro).

## Stack

- **Backend:** Laravel 13 + Inertia.js
- **Frontend:** React 18 + Tailwind CSS + ShadCN-style UI
- **Base de données:** PostgreSQL (SQLite en dev local)
- **Animations:** Framer Motion + Tailwind

## Démarrage rapide

### Prérequis

- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL (ou SQLite pour tester)

### Installation

```bash
composer install
cp .env.example .env
php artisan key:generate

# Configurer la base de données dans .env
# Puis :
php artisan migrate --seed

npm install --legacy-peer-deps
npm run dev
```

Dans un second terminal :

```bash
php artisan serve
```

Ouvrir [http://localhost:8000](http://localhost:8000)

### Variables d'environnement importantes

| Variable | Description |
|----------|-------------|
| `WHATSAPP_NUMBER` | Numéro WhatsApp (ex: `212600000000`) |
| `MAIL_ADMIN` | Email admin pour les messages contact |
| `DB_*` | Configuration PostgreSQL |

## Pages

| Route | Page |
|-------|------|
| `/` | Accueil |
| `/produits` | Catalogue avec filtres |
| `/produits/{slug}` | Détail produit |
| `/categories/{slug}` | Produits par catégorie |
| `/a-propos` | À propos |
| `/contact` | Formulaire de contact |
| `/sitemap.xml` | Sitemap SEO |

## Données de démo

Le seeder crée :
- 6 catégories (cuisine pro, nettoyage, hôtellerie, bureau, outillage, mobilier)
- 16 produits (8 vedettes)
- Paramètres du site (téléphone, email, réseaux sociaux)

## Personnalisation

1. **Logo** : remplacer `public/images/logo.png`
2. **Coordonnées** : modifier `database/seeders/SiteSettingSeeder.php` puis `php artisan db:seed --class=SiteSettingSeeder`
3. **WhatsApp** : `.env` → `WHATSAPP_NUMBER=212XXXXXXXXX`
4. **Couleurs** : `tailwind.config.js` (primary `#1A3FCB`, accent `#E8151B`)

## Production

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Structure

```
resources/js/
├── Components/     # Navbar, Footer, ProductCard, UI ShadCN
├── Layouts/        # MainLayout
└── Pages/          # Home, Products, Contact, About...
```
