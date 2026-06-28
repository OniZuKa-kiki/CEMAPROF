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
