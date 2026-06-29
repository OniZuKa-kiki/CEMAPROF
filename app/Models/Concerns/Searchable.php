<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    public function scopeSearch(Builder $query, ?string $term, array $columns = ['name']): Builder
    {
        if (! $term || trim($term) === '') {
            return $query;
        }

        $term = self::normalizeSearchTerm($term);
        $like = '%'.$term.'%';

        return $query->where(function (Builder $q) use ($columns, $like) {
            foreach ($columns as $column) {
                $q->orWhereRaw(self::accentInsensitiveColumn($column).' LIKE ?', [$like]);
            }
        });
    }

    private static function normalizeSearchTerm(string $term): string
    {
        $normalized = mb_strtolower(trim($term));
        $normalized = str_replace(
            ['á', 'à', 'â', 'ä', 'ã', 'å', 'é', 'è', 'ê', 'ë', 'í', 'ì', 'î', 'ï', 'ó', 'ò', 'ô', 'ö', 'õ', 'ú', 'ù', 'û', 'ü', 'ç', 'ñ'],
            ['a', 'a', 'a', 'a', 'a', 'a', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'c', 'n'],
            $normalized,
        );

        return $normalized;
    }

    private static function accentInsensitiveColumn(string $column): string
    {
        $expression = 'LOWER('.$column.')';
        $replacements = [
            'á' => 'a', 'à' => 'a', 'â' => 'a', 'ä' => 'a', 'ã' => 'a', 'å' => 'a',
            'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
            'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
            'ó' => 'o', 'ò' => 'o', 'ô' => 'o', 'ö' => 'o', 'õ' => 'o',
            'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
            'ç' => 'c', 'ñ' => 'n',
        ];

        foreach ($replacements as $from => $to) {
            $expression = "REPLACE({$expression}, '{$from}', '{$to}')";
        }

        return $expression;
    }
}
