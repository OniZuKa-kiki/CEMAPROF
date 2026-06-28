<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingRequest;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        $settings = SiteSetting::allCached();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'site_name' => $settings['site_name'] ?? config('app.name'),
                'phone' => $settings['phone'] ?? '',
                'email' => $settings['email'] ?? '',
                'address' => $settings['address'] ?? '',
                'whatsapp' => $settings['whatsapp'] ?? config('cemaprof.whatsapp'),
                'facebook' => $settings['facebook'] ?? '',
                'instagram' => $settings['instagram'] ?? '',
                'linkedin' => $settings['linkedin'] ?? '',
                'opening_hours' => $settings['opening_hours'] ?? '',
                'google_maps_embed' => $settings['google_maps_embed'] ?? '',
            ],
        ]);
    }

    public function update(SettingRequest $request): RedirectResponse
    {
        foreach ($request->validated() as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        SiteSetting::clearCache();

        return back()->with('success', 'Paramètres enregistrés avec succès.');
    }
}
