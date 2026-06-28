<x-mail::message>
# Import produits terminé

Bonjour {{ $adminName }},

L'import CSV est terminé.

- **{{ $created }}** produit(s) créé(s)
- **{{ $skipped }}** ignoré(s) (doublons)

@if(count($errors))
**Erreurs ({{ count($errors) }} ligne(s)) :**
@foreach(array_slice($errors, 0, 10) as $error)
- {{ $error }}
@endforeach
@if(count($errors) > 10)
_… et {{ count($errors) - 10 }} autre(s) erreur(s)._
@endif
@endif

<x-mail::button :url="$productsUrl">
Voir le catalogue
</x-mail::button>

Merci,<br>
{{ config('app.name') }}
</x-mail::message>
