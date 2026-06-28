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
            'phone' => '+212 5 22 00 00 00',
            'whatsapp' => '212600000000',
            'email' => 'contact@cemaprof.ma',
            'email_secondary' => 'commercial@cemaprof.ma',
            'email_tertiary' => 'devis@cemaprof.ma',
            'email_secondary_enabled' => '0',
            'email_tertiary_enabled' => '0',
            'address' => 'Zone Industrielle, Casablanca, Maroc',
            'facebook' => 'https://facebook.com/cemaprof',
            'instagram' => 'https://instagram.com/cemaprof',
            'linkedin' => 'https://linkedin.com/company/cemaprof',
            'opening_hours' => 'Lun - Sam : 8h30 - 18h30 | Dim : Fermé',
            'google_maps_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.5!2d-7.5898!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzIzLjIiTiA3wrAzNSczMy4zIlc!5e0!3m2!1sfr!2sma!4v1234567890',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
