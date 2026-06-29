<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingRequest;
use App\Models\SiteSetting;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        $settings = SiteSetting::allCached();
        $defaultCompany = config('cemaprof.company', []);
        $activityLines = $settings['activity_lines'] ?? null;

        if ($activityLines === null && ! empty($defaultCompany['activity_lines'])) {
            $activityLines = implode("\n", $defaultCompany['activity_lines']);
        }

        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'site_name' => $settings['site_name'] ?? config('app.name'),
                'site_tagline' => $settings['site_tagline'] ?? ($defaultCompany['tagline'] ?? ''),
                'company_description' => $settings['company_description'] ?? ($defaultCompany['description'] ?? ''),
                'activity_lines' => $activityLines ?? '',
                'phone' => $settings['phone'] ?? '',
                'email' => $settings['email'] ?? '',
                'email_secondary' => $settings['email_secondary'] ?? '',
                'email_tertiary' => $settings['email_tertiary'] ?? '',
                'address' => $settings['address'] ?? '',
                'whatsapp' => $settings['whatsapp'] ?? config('cemaprof.whatsapp'),
                'facebook' => $settings['facebook'] ?? '',
                'instagram' => $settings['instagram'] ?? '',
                'linkedin' => $settings['linkedin'] ?? '',
                'opening_hours' => $settings['opening_hours'] ?? '',
                'google_maps_url' => $settings['google_maps_url'] ?? ($defaultCompany['maps_url'] ?? ''),
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

        AuditLogger::log('settings.updated', 'settings', null, [
            'keys' => array_keys($request->validated()),
        ]);

        return back()->with('success', 'Paramètres enregistrés avec succès.');
    }
}
