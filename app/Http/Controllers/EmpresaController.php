<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class EmpresaController extends Controller
{
    public function index()
    {   
        $user = Auth::user();

        $empresas = $user->is_admin 
            ? Empresa::all() 
            : $user->empresas;

        return Inertia::render('Empresas/Index', [
            'empresas' => $empresas
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'rut' => 'required|unique:empresas',
            'razonSocial' => 'required',
            'logo' => 'nullable|image|max:2048', // 2MB max
        ]);

        $empresa = Empresa::create($request->only('rut', 'razon_social'));

        
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $empresa->update(['logo' => $path]);
        }

        return redirect()->route('empresas.index');
    }
}