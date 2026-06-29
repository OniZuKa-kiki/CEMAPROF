<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'delivery_city',
        'delivery_mode',
        'delivery_notes',
        'subject',
        'message',
        'product_slug',
        'product_slugs',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'product_slugs' => 'array',
    ];
}
