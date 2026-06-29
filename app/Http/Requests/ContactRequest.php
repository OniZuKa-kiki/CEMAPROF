<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'company' => ['nullable', 'string', 'max:255'],
            'delivery_city' => ['nullable', 'string', 'max:120'],
            'delivery_mode' => ['nullable', 'string', 'in:livraison,retrait,a_preciser'],
            'delivery_notes' => ['nullable', 'string', 'max:500'],
            'subject' => ['required', 'string', 'in:devis,info-produit,sav,autre'],
            'product_slug' => ['nullable', 'string', 'max:255'],
            'product_slugs' => ['nullable', 'array'],
            'product_slugs.*' => ['string', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'Veuillez entrer une adresse email valide.',
            'subject.required' => 'Le sujet est obligatoire.',
            'subject.in' => 'Veuillez sélectionner un sujet valide.',
            'message.required' => 'Le message est obligatoire.',
            'message.min' => 'Le message doit contenir au moins 10 caractères.',
        ];
    }
}
