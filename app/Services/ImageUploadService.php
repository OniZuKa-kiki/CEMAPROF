<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadService
{
    public static function store(UploadedFile $file, string $directory): string
    {
        $webpUrl = self::tryStoreAsWebp($file, $directory);

        if ($webpUrl) {
            return $webpUrl;
        }

        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs($directory, $filename, 'public');

        return Storage::disk('public')->url($path);
    }

    public static function storeMany(array $files, string $directory): array
    {
        return collect($files)
            ->filter(fn ($file) => $file instanceof UploadedFile)
            ->map(fn (UploadedFile $file) => self::store($file, $directory))
            ->values()
            ->all();
    }

    public static function deleteIfLocal(?string $url): void
    {
        if (! $url || ! str_contains($url, '/storage/')) {
            return;
        }

        $path = str_replace(Storage::disk('public')->url(''), '', $url);
        Storage::disk('public')->delete(ltrim($path, '/'));
    }

    private static function tryStoreAsWebp(UploadedFile $file, string $directory): ?string
    {
        if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
            return null;
        }

        $mime = $file->getMimeType();

        $image = match ($mime) {
            'image/jpeg', 'image/jpg' => @imagecreatefromjpeg($file->getRealPath()),
            'image/png' => @imagecreatefrompng($file->getRealPath()),
            default => null,
        };

        if (! $image) {
            return null;
        }

        if ($mime === 'image/png') {
            imagepalettetotruecolor($image);
            imagealphablending($image, true);
            imagesavealpha($image, true);
        }

        $filename = Str::uuid().'.webp';
        $relativePath = trim($directory, '/').'/'.$filename;

        Storage::disk('public')->makeDirectory($directory);

        $fullPath = Storage::disk('public')->path($relativePath);

        if (! @imagewebp($image, $fullPath, 82)) {
            imagedestroy($image);

            return null;
        }

        imagedestroy($image);

        return Storage::disk('public')->url($relativePath);
    }
}
