<x-mail::message>
# Nouveau message reçu

**{{ $message->name }}** vous a écrit via le formulaire contact.

**Sujet :** {{ $subjectLabel }}

@if($message->phone)
**Téléphone :** {{ $message->phone }}
@endif

@if($message->company)
**Entreprise :** {{ $message->company }}
@endif

@if($message->delivery_mode || $message->delivery_city || $message->delivery_notes)
**Expédition (indicatif) :**
@if($message->delivery_mode)
- Mode : {{ match($message->delivery_mode) { 'livraison' => 'Livraison au Maroc', 'retrait' => 'Retrait à Casablanca', default => 'À préciser' } }}
@endif
@if($message->delivery_city)
- Ville : {{ $message->delivery_city }}
@endif
@if($message->delivery_notes)
- Note : {{ $message->delivery_notes }}
@endif
@endif

@if(count($productNames))
**Produit(s) concerné(s) :**
@foreach($productNames as $productName)
- {{ $productName }}
@endforeach
@endif

---

{{ $message->message }}

<x-mail::button :url="$adminUrl">
Voir dans l'admin
</x-mail::button>

Répondre directement à ce mail contactera **{{ $message->email }}**.

Merci,<br>
{{ config('app.name') }}
</x-mail::message>
