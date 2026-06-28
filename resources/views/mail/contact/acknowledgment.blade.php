<x-mail::message>
# Bonjour {{ $message->name }},

Nous avons bien reçu votre message concernant **{{ $subjectLabel }}**.

Notre équipe le traite et vous répondra sous **24 heures ouvrées**.

@if($contactPhone)
En attendant, vous pouvez aussi nous joindre au **{{ $contactPhone }}**.
@endif

Merci pour votre confiance,<br>
L'équipe **{{ $siteName }}**
</x-mail::message>
