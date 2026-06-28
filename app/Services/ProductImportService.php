<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ProductImportService
{
  public const TEMPLATE_HEADERS = [
        'nom',
        'categorie',
        'description_courte',
        'description',
        'badge',
        'actif',
        'vedette',
        'image_url',
    ];

    public function templateCsv(): string
    {
        $lines = [
            implode(';', self::TEMPLATE_HEADERS),
            'Four Professionnel 6 Niveaux;Cuisine Professionnelle;Four inox pour restauration.;Four professionnel en acier inoxydable...;nouveau;1;0;https://exemple.com/image.jpg',
        ];

        return implode("\n", $lines);
    }

    /**
     * @return array{created: int, skipped: int, errors: array<int, string>}
     */
    public function importFromCsv(UploadedFile $file): array
    {
        $path = $file->getRealPath();
        $handle = fopen($path, 'r');

        if ($handle === false) {
            return ['created' => 0, 'skipped' => 0, 'errors' => ['Impossible de lire le fichier CSV.']];
        }

        $firstLine = fgets($handle);
        if ($firstLine === false) {
            fclose($handle);

            return ['created' => 0, 'skipped' => 0, 'errors' => ['Le fichier CSV est vide.']];
        }

        $delimiter = substr_count($firstLine, ';') >= substr_count($firstLine, ',') ? ';' : ',';
        rewind($handle);

        $headers = null;
        $created = 0;
        $skipped = 0;
        $errors = [];
        $lineNumber = 0;
        $categories = Category::all()->keyBy(fn ($c) => Str::lower($c->name));

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $lineNumber++;

            if ($headers === null) {
                $headers = $this->normalizeHeaders($row);

                continue;
            }

            if ($this->isEmptyRow($row)) {
                continue;
            }

            $data = $this->mapRow($headers, $row);

            if (empty($data['nom'])) {
                $errors[] = "Ligne {$lineNumber} : le nom est obligatoire.";

                continue;
            }

            if (empty($data['categorie'])) {
                $errors[] = "Ligne {$lineNumber} ({$data['nom']}) : la catégorie est obligatoire.";

                continue;
            }

            $category = $categories->get(Str::lower(trim($data['categorie'])));

            if (! $category) {
                $category = Category::query()
                    ->whereRaw('LOWER(slug) = ?', [Str::slug($data['categorie'])])
                    ->first();
            }

            if (! $category) {
                $errors[] = "Ligne {$lineNumber} ({$data['nom']}) : catégorie « {$data['categorie']} » introuvable.";

                continue;
            }

            $slug = Str::slug($data['nom']);

            if (Product::where('slug', $slug)->exists()) {
                $skipped++;
                $errors[] = "Ligne {$lineNumber} ({$data['nom']}) : déjà existant, ignoré.";

                continue;
            }

            $badge = $this->normalizeBadge($data['badge'] ?? '');

            Product::create([
                'category_id' => $category->id,
                'name' => trim($data['nom']),
                'slug' => $slug,
                'short_description' => trim($data['description_courte'] ?? '') ?: null,
                'description' => trim($data['description'] ?? '') ?: null,
                'badge' => $badge,
                'is_active' => $this->toBool($data['actif'] ?? '1', true),
                'is_featured' => $this->toBool($data['vedette'] ?? '0', false),
                'image_url' => trim($data['image_url'] ?? '') ?: null,
            ]);

            $created++;
        }

        fclose($handle);

        return compact('created', 'skipped', 'errors');
    }

    private function normalizeHeaders(array $row): array
    {
        return array_map(function ($header) {
            $header = Str::ascii(mb_strtolower(trim($header)));
            $header = str_replace([' ', '-'], '_', $header);

            return match ($header) {
                'name' => 'nom',
                'category', 'categorie' => 'categorie',
                'short_description', 'description_courte' => 'description_courte',
                'description_longue' => 'description',
                'featured', 'vedette', 'en_vedette' => 'vedette',
                'active', 'actif' => 'actif',
                default => $header,
            };
        }, $row);
    }

    private function mapRow(array $headers, array $row): array
    {
        $data = [];

        foreach ($headers as $index => $header) {
            $data[$header] = trim($row[$index] ?? '');
        }

        return $data;
    }

    private function isEmptyRow(array $row): bool
    {
        return count(array_filter($row, fn ($cell) => trim((string) $cell) !== '')) === 0;
    }

    private function normalizeBadge(string $value): ?string
    {
        $value = Str::lower(trim($value));

        if ($value === '' || in_array($value, ['aucun', 'none', '0', '-'], true)) {
            return null;
        }

        return in_array($value, ['nouveau', 'populaire', 'promo'], true) ? $value : null;
    }

    private function toBool(string $value, bool $default): bool
    {
        $value = Str::lower(trim($value));

        if ($value === '') {
            return $default;
        }

        return in_array($value, ['1', 'oui', 'yes', 'true', 'vrai', 'actif'], true);
    }
}
