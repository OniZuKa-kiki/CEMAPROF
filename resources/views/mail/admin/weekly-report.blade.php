<x-mail::message>
# Rapport hebdomadaire CEMAPROF

Période : **{{ $stats['period'] }}**

## Messages contact
- **{{ $stats['messages_total'] }}** message(s) reçu(s)
- **{{ $stats['messages_unread'] }}** non lu(s)
- **{{ $stats['quotes_total'] }}** demande(s) de devis

## Catalogue
- **{{ $stats['products_active'] }}** produit(s) actif(s)
- **{{ $stats['products_featured'] }}** en vedette

@if(count($stats['top_products']))
## Produits les plus demandés en devis
@foreach($stats['top_products'] as $product)
- {{ $product['name'] }} ({{ $product['count'] }}×)
@endforeach
@endif

<x-mail::button :url="$messagesUrl">
Voir les messages
</x-mail::button>

<x-mail::button :url="$dashboardUrl" color="success">
Tableau de bord
</x-mail::button>

Bonne semaine,<br>
{{ config('app.name') }}
</x-mail::message>
