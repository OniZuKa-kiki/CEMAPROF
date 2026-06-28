<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ContactMessage::query();

        match ($request->input('tab', 'all')) {
            'unread' => $query->where('is_read', false),
            'read' => $query->where('is_read', true),
            default => null,
        };

        if ($request->filled('subject')) {
            $query->where('subject', $request->subject);
        }

        if ($request->filled('search')) {
            $term = '%'.mb_strtolower(trim($request->search)).'%';
            $query->where(function ($q) use ($term) {
                $q->whereRaw('LOWER(name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(phone) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(company) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(message) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(product_slug) LIKE ?', [$term]);
            });
        }

        match ($request->input('sort', 'recent')) {
            'oldest' => $query->orderBy('created_at'),
            'name' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            default => $query->latest(),
        };

        $perPage = min(max((int) $request->input('per_page', 25), 10), 100);

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $query->paginate($perPage)->withQueryString(),
            'filters' => $request->only(['tab', 'search', 'subject', 'sort', 'per_page']),
            'counts' => [
                'all' => ContactMessage::count(),
                'unread' => ContactMessage::where('is_read', false)->count(),
                'read' => ContactMessage::where('is_read', true)->count(),
            ],
        ]);
    }

    public function show(ContactMessage $message): Response
    {
        if (! $message->is_read) {
            $message->update(['is_read' => true]);
        }

        return Inertia::render('Admin/Messages/Show', [
            'message' => $message->fresh(),
        ]);
    }

    public function toggleRead(ContactMessage $message): RedirectResponse
    {
        $message->update(['is_read' => ! $message->is_read]);

        return back();
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        return redirect()->route('admin.messages.index')->with('success', 'Message supprimé.');
    }
}
