<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*','api/contact-us','contact-us','https://lenis-xi.vercel.app/','https://lenis-xi.vercel.app/api/*',
        'https://lenis-xi.vercel.app/api/contact-us'
    ];
}
