<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforceAdminSessionTimeout
{
    public function handle(Request $request, Closure $next): Response
    {
        $lifetimeMinutes = (int) config('cemaprof.admin_session_lifetime', 120);
        $lastActivity = $request->session()->get('admin_last_activity');

        if ($lastActivity !== null) {
            $idleSeconds = time() - (int) $lastActivity;

            if ($idleSeconds > ($lifetimeMinutes * 60)) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()
                    ->route('admin.login')
                    ->with('status', 'Votre session a expiré. Veuillez vous reconnecter.');
            }
        }

        $request->session()->put('admin_last_activity', time());

        return $next($request);
    }
}
