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

        $term = mb_strtolower(trim($term));
        $like = '%'.$term.'%';

        return $query->where(function (Builder $q) use ($columns, $like) {
            foreach ($columns as $column) {
                $q->orWhereRaw('LOWER('.$column.') LIKE ?', [$like]);
            }
        });
    }
}
