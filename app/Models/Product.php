<?php

namespace App\Models;

use App\Models\Concerns\Searchable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use Searchable;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'short_description',
        'description',
        'price',
        'brand',
        'availability',
        'image_url',
        'images',
        'badge',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $appends = ['all_images'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getAllImagesAttribute(): array
    {
        $images = $this->images ?? [];

        if ($this->image_url && ! in_array($this->image_url, $images)) {
            array_unshift($images, $this->image_url);
        }

        return $images;
    }

    public function scopeCatalog($query)
    {
        return $query
            ->where('is_active', true)
            ->whereHas('category', fn ($q) => $q->catalog());
    }
}
