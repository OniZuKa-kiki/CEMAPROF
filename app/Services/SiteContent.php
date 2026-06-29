<?php

namespace App\Services;

use App\Models\SiteSetting;

class SiteContent
{
    public static function faqItems(): array
    {
        return self::decodeSetting('faq_items', self::defaultFaq());
    }

    public static function cgvSections(): array
    {
        return self::decodeSetting('cgv_sections', self::defaultCgv());
    }

    public static function partnerBrandSlugs(): array
    {
        $stored = self::decodeSetting('partner_brand_slugs', null);

        if (is_array($stored) && $stored !== []) {
            return array_values($stored);
        }

        return array_map(fn (array $brand) => $brand['slug'], self::partnerBrandCatalog());
    }

    public static function partnerBrandCatalog(): array
    {
        return self::decodeSetting('partner_brand_catalog', self::defaultPartnerBrands());
    }

    public static function savePartnerBrandCatalog(array $catalog): void
    {
        SiteSetting::updateOrCreate(
            ['key' => 'partner_brand_catalog'],
            ['value' => json_encode(array_values($catalog), JSON_UNESCAPED_UNICODE)],
        );
        SiteSetting::clearCache();
    }

    public static function savePartnerBrandSlugs(array $slugs): void
    {
        SiteSetting::updateOrCreate(
            ['key' => 'partner_brand_slugs'],
            ['value' => json_encode(array_values($slugs), JSON_UNESCAPED_UNICODE)],
        );
        SiteSetting::clearCache();
    }

    public static function defaultPartnerBrands(): array
    {
        return [
            ['name' => 'Bosch', 'slug' => 'bosch', 'file' => 'bosch.png', 'scale' => 1],
            ['name' => 'Makita', 'slug' => 'makita', 'file' => 'makita.png', 'scale' => 1],
            ['name' => 'DeWalt', 'slug' => 'dewalt', 'file' => 'dewalt.png', 'scale' => 1],
            ['name' => 'Stanley', 'slug' => 'stanley', 'file' => 'stanley.png', 'scale' => 1],
            ['name' => 'Facom', 'slug' => 'facom', 'file' => 'facom.png', 'scale' => 1],
            ['name' => 'Schneider', 'slug' => 'schneider', 'file' => 'Schneider.png', 'scale' => 1.7],
            ['name' => 'Grundfos', 'slug' => 'grundfos', 'file' => 'grundfos.png', 'scale' => 2.3],
            ['name' => 'Kärcher', 'slug' => 'karcher', 'file' => 'karcher.png', 'scale' => 2],
            ['name' => '3M', 'slug' => '3m', 'file' => '3m.png', 'scale' => 1],
            ['name' => 'Hitachi', 'slug' => 'hitachi', 'file' => 'hitachi.png', 'scale' => 1.35],
            ['name' => 'Metabo', 'slug' => 'metabo', 'file' => 'metabo.png', 'scale' => 1.55],
            ['name' => 'Würth', 'slug' => 'wurth', 'file' => 'wurth.png', 'scale' => 1.85],
            ['name' => 'Nilfisk', 'slug' => 'nilfisk', 'file' => 'nilfisk.png', 'scale' => 2.1],
            ['name' => 'Festool', 'slug' => 'festool', 'file' => 'festool.png', 'scale' => 1.95],
            ['name' => 'Knipex', 'slug' => 'knipex', 'file' => 'knipex.png', 'scale' => 1.15],
            ['name' => 'Bahco', 'slug' => 'bahco', 'file' => 'bahco.png', 'scale' => 1],
            ['name' => 'Legrand', 'slug' => 'legrand', 'file' => 'legrand.png', 'scale' => 1.9],
            ['name' => 'Hilti', 'slug' => 'hilti', 'file' => 'hilti.png', 'scale' => 1],
            ['name' => 'Saint-Gobain', 'slug' => 'saint-gobain', 'file' => 'saint-gobain.png', 'scale' => 1.85],
        ];
    }

    public static function partnerBrandsForMarquee(): array
    {
        $catalog = collect(self::partnerBrandCatalog())->keyBy('slug');
        $slugs = self::partnerBrandSlugs();

        return collect($slugs)
            ->map(fn (string $slug) => $catalog->get($slug))
            ->filter()
            ->values()
            ->all();
    }

    private static function decodeSetting(string $key, mixed $fallback): mixed
    {
        $raw = SiteSetting::get($key);

        if ($raw === null || $raw === '') {
            return $fallback;
        }

        $decoded = json_decode($raw, true);

        return json_last_error() === JSON_ERROR_NONE ? $decoded : $fallback;
    }

    private static function defaultFaq(): array
    {
        return [
            ['icon' => 'products', 'q' => 'Quels produits propose CEMAPROF ?', 'a' => "Importateur distributeur d'outillage et matériel industriel et agricole, tuyauterie, pompes et motopompes, protection individuelle (EPI), quincaillerie et droguerie générale. Parcourez le catalogue ou contactez-nous pour un besoin spécifique."],
            ['icon' => 'quote', 'q' => 'Comment demander un devis pour plusieurs produits ?', 'a' => 'Depuis le catalogue, cliquez sur « Ajouter à ma sélection » pour chaque article souhaité. Un panneau devis apparaît en bas de page : vérifiez votre liste puis finalisez la demande sur la page contact ou via WhatsApp.'],
            ['icon' => 'pricing', 'q' => 'Les prix affichés sont-ils définitifs ?', 'a' => 'Les prix indicatifs servent de référence. Le tarif final dépend des quantités, références exactes et conditions de livraison. Un devis détaillé vous est toujours communiqué avant validation.'],
            ['icon' => 'delivery', 'q' => 'Livrez-vous partout au Maroc ?', 'a' => "Oui, la livraison est assurée sur l'ensemble du territoire marocain. Les délais et frais sont précisés dans votre devis."],
            ['icon' => 'location', 'q' => 'Où êtes-vous situés ?', 'a' => "Boulevard des Forces Auxiliaires, Hay Moulay Rachid, Casablanca. L'adresse exacte est indiquée sur la page contact avec une carte Google Maps."],
            ['icon' => 'advice', 'q' => 'Puis-je obtenir des conseils sur un produit ?', 'a' => "Oui. Contactez-nous par téléphone, WhatsApp ou formulaire pour être orienté sur l'outillage, les pompes, la tuyauterie ou les EPI adaptés à votre activité."],
            ['icon' => 'payment', 'q' => 'Quels moyens de paiement acceptez-vous ?', 'a' => 'Les modalités de paiement (virement, chèque, conditions professionnelles) sont définies dans le devis selon votre profil et le montant de la commande.'],
        ];
    }

    private static function defaultCgv(): array
    {
        return [
            ['title' => '1. Objet', 'content' => "Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre CEMAPROF, importateur distributeur d'outillage et matériel industriel et agricole, et tout client professionnel ou particulier souhaitant acquérir des produits via notre site ou nos canaux de contact."],
            ['title' => '2. Devis et commande', 'content' => "Toute commande fait l'objet d'un devis préalable. Le devis est valable 30 jours sauf mention contraire. La commande devient ferme après acceptation écrite du devis par le client (signature, e-mail ou validation explicite)."],
            ['title' => '3. Prix', 'content' => 'Les prix sont exprimés en dirhams marocains (MAD), hors taxes sauf indication contraire. Les tarifs indicatifs affichés sur le site peuvent évoluer ; seul le devis accepté fait foi.'],
            ['title' => '4. Livraison', 'content' => 'Les délais de livraison sont communiqués sur le devis. CEMAPROF informe le client en cas de retard. Les risques sont transférés à la réception du matériel.'],
            ['title' => '5. Garantie', 'content' => "Les produits bénéficient de la garantie constructeur lorsqu'elle s'applique. Les conditions spécifiques (durée, exclusions) sont précisées sur le devis ou la documentation du fabricant."],
            ['title' => '6. Réclamations', 'content' => "Toute réclamation concernant la conformité ou l'état du matériel doit être formulée par écrit dans les délais légaux à compter de la réception. Contactez-nous via le formulaire ou par téléphone."],
            ['title' => '7. Données personnelles', 'content' => 'Les informations collectées via le formulaire contact servent uniquement au traitement de votre demande de devis ou commande. Pour toute question relative à vos données, contactez-nous à contact@cemaprof.ma.'],
            ['title' => '8. Litiges', 'content' => 'En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux de Casablanca seront seuls compétents, sous réserve des dispositions légales impératives.'],
        ];
    }
}
