<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@cemaprof.ma'],
            [
                'name' => 'Administrateur CEMAPROF',
                'password' => Hash::make('Admin@2024!'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
