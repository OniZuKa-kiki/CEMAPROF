<x-mail::message>
# Bonjour {{ $message->name }},

{{ $adminName }} de **{{ $siteName }}** vous répond :

---

{!! nl2br(e($replyBody)) !!}

---

Pour toute précision, répondez directement à cet email.

Cordialement,<br>
**{{ $siteName }}**
</x-mail::message>
