<?php

namespace App\Http\Controllers;

class EstadoController extends Controller
{
    public function index()
    {
        return Inertia::render('Estados/Index', [
            'estados' => Estado::all(),
        ]);
    }
}
