<?php

namespace App\Services;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class CatalogCache
{
    public const TTL_SECONDS = 600;

    public static function remember(string $key, callable $callback): mixed
    {
        return Cache::remember("catalog.{$key}", self::TTL_SECONDS, $callback);
    }

    /**
     * Cache a list of models/scalars as plain arrays (safe for JSON + Inertia).
     *
     * @return array<int, mixed>
     */
    public static function rememberArray(string $key, callable $callback): array
    {
        $cached = Cache::get("catalog.{$key}");

        if (is_array($cached)) {
            return $cached;
        }

        $value = self::serializeItems($callback());

        Cache::put("catalog.{$key}", $value, self::TTL_SECONDS);

        return $value;
    }

    public static function serializeItems(mixed $result): array
    {
        if ($result instanceof Collection) {
            return $result
                ->map(fn ($item) => self::serializeItem($item))
                ->values()
                ->all();
        }

        if ($result instanceof Model) {
            return [self::serializeItem($result)];
        }

        if (is_array($result)) {
            return collect($result)
                ->map(fn ($item) => self::serializeItem($item))
                ->values()
                ->all();
        }

        return [];
    }

    public static function serializeItem(mixed $item): mixed
    {
        if ($item instanceof Model) {
            return $item->toArray();
        }

        if ($item instanceof Arrayable) {
            return $item->toArray();
        }

        return $item;
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
