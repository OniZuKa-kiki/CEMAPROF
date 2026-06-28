<x-mail::message>
# Devis prioritaire

Une demande de devis avec **{{ count($productNames) }} produit(s)** vient d'arriver.

**Client :** {{ $message->name }} ({{ $message->email }})

@if($message->phone)
**Téléphone :** {{ $message->phone }}
@endif

**Produits :**
@foreach($productNames as $productName)
- {{ $productName }}
@endforeach

---

{{ $message->message }}

<x-mail::button :url="$adminUrl">
Traiter ce devis
</x-mail::button>

Merci,<br>
{{ config('app.name') }}
</x-mail::message>
