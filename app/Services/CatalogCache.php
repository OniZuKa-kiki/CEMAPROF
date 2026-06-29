<?php

namespace App\Services;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class CatalogCache
{
    public const TTL_SECONDS = 600;

    public static function remember(string $key, callable $callback): mixed
    {
        return Cache::remember("catalog.{$key}", self::TTL_SECONDS, $callback);
    }

    public static function rememberArray(string $key, callable $callback): array
    {
        $value = self::remember($key, fn () => self::normalizeArray($callback()));

        return self::normalizeArray($value);
    }

    public static function normalizeArray(mixed $value): array
    {
        if ($value instanceof Collection) {
            return $value->values()->all();
        }

        if ($value instanceof Arrayable) {
            return collect($value->toArray())->values()->all();
        }

        if (is_array($value)) {
            return array_values($value);
        }

        return [];
    }

    public static function flush(): void
    {
        foreach ([
            'filter_counts',
            'categories',
            'brands',
            'price_bounds',
            'home_featured',
            'home_categories',
            'nav_categories',
            'sitemap',
        ] as $key) {
            Cache::forget("catalog.{$key}");
        }
    }
}
