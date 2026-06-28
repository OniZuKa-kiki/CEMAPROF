<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, ?string $default = null): ?string
    {
        return Cache::rememberForever("site_setting.{$key}", function () use ($key, $default) {
            return static::query()->where('key', $key)->value('value') ?? $default;
        });
    }

    public static function allCached(): array
    {
        return Cache::rememberForever('site_settings.all', function () {
            return static::query()->pluck('value', 'key')->toArray();
        });
    }

    protected static function booted(): void
    {
        static::saved(fn () => static::clearCache());
        static::deleted(fn () => static::clearCache());
    }

    public static function clearCache(): void
    {
        Cache::forget('site_settings.all');
        foreach (static::query()->pluck('key') as $key) {
            Cache::forget("site_setting.{$key}");
        }
    }
}
