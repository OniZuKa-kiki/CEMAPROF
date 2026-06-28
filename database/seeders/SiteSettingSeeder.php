<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'site_name' => 'CEMAPROF',
            'site_tagline' => 'Importateur · Distributeur',
            'company_description' => config('cemaprof.company.description'),
            'phone' => '+212 5 22 72 60 68',
            'whatsapp' => '212522726068',
            'email' => 'contact@cemaprof.ma',
            'email_secondary' => 'commercial@cemaprof.ma',
            'email_tertiary' => 'devis@cemaprof.ma',
            'email_secondary_enabled' => '0',
            'email_tertiary_enabled' => '0',
            'address' => 'Boulevard des Forces Auxiliaires, Hay Moulay Rachid, Casablanca, Maroc',
            'facebook' => '',
            'instagram' => '',
            'linkedin' => '',
            'opening_hours' => 'Lun - Ven : 9h00 - 18h30 | Sam - Dim : Fermé',
            'google_maps_url' => config('cemaprof.company.maps_url'),
            'google_maps_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.387338701499!2d-7.560921823776426!3d33.56929104307628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cdeb7399ea03%3A0x1a6d71e47b226af2!2sCEMAPROF!5e0!3m2!1sfr!2sma!4v1782647385172!5m2!1sfr!2sma',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
