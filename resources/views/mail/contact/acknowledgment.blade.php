<x-mail::message>
# Bonjour {{ $message->name }},

Nous avons bien reçu votre message concernant **{{ $subjectLabel }}**.

Nous le traitons et vous répondrons sous **24 heures ouvrées**.

@if($contactPhone)
En attendant, vous pouvez aussi nous joindre au **{{ $contactPhone }}**.
@endif

Merci pour votre confiance,<br>
**{{ $siteName }}**
</x-mail::message>
