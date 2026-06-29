<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SiteSettingSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            BrandSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
