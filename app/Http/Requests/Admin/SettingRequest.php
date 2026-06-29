<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'site_name' => ['required', 'string', 'max:255'],
            'site_tagline' => ['nullable', 'string', 'max:255'],
            'company_description' => ['nullable', 'string', 'max:2000'],
            'activity_lines' => ['nullable', 'string', 'max:4000'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'email_secondary' => ['nullable', 'email', 'max:255'],
            'email_tertiary' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'facebook' => ['nullable', 'url', 'max:255'],
            'instagram' => ['nullable', 'url', 'max:255'],
            'linkedin' => ['nullable', 'url', 'max:255'],
            'opening_hours' => ['nullable', 'string', 'max:255'],
            'google_maps_url' => ['nullable', 'url', 'max:1000'],
            'google_maps_embed' => ['nullable', 'url', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'site_name.required' => 'Le nom du site est obligatoire.',
            'email.email' => 'L\'adresse e-mail n\'est pas valide.',
            'email_secondary.email' => 'L\'adresse e-mail secondaire n\'est pas valide.',
            'email_tertiary.email' => 'L\'adresse e-mail tertiaire n\'est pas valide.',
            'facebook.url' => 'Le lien Facebook doit être une URL valide.',
            'instagram.url' => 'Le lien Instagram doit être une URL valide.',
            'linkedin.url' => 'Le lien LinkedIn doit être une URL valide.',
            'google_maps_url.url' => 'Le lien Google Maps doit être une URL valide.',
            'google_maps_embed.url' => 'L\'URL d\'intégration Google Maps doit être valide.',
        ];
    }
}
