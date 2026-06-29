<?php

namespace App\Observers;

use App\Services\CatalogCache;

class CatalogCacheObserver
{
    public function saved(): void
    {
        CatalogCache::flush();
    }

    public function deleted(): void
    {
        CatalogCache::flush();
    }
}
