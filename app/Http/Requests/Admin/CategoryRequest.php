<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($categoryId)],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'image' => ['nullable', 'image', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la catégorie est obligatoire.',
            'slug.required' => 'Le slug est obligatoire.',
            'slug.unique' => 'Ce slug est déjà utilisé par une autre catégorie.',
            'image.image' => 'Le fichier doit être une image.',
            'image.max' => 'L\'image ne peut pas dépasser 5 Mo.',
        ];
    }
}
