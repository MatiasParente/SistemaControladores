<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{

    public function index(Request $request)
    {  
        if (!auth()->user()->is_admin) {
            abort(403, 'No tienes permiso para realizar esta acción o ver esta página.');
        }

        $buscar = $request->input('buscar');
        $buscarEmpresa = $request->input('buscarEmpresa');

        $users = User::query()
            ->with(['empresas'])
            ->latest()
            ->when($buscar, function ($query) use ($buscar) {
                $query->where(function ($q) use ($buscar) {
                    $q->where('name', 'ILIKE', "%{$buscar}%")
                      ->orWhere('email', 'ILIKE', "%{$buscar}%");
                });
            })
            ->when($buscarEmpresa, function ($query) use ($buscarEmpresa) {
                $query->whereHas('empresas', function ($q) use ($buscarEmpresa) {
                    $q->where('empresa.id', $buscarEmpresa);
                });
            })
            ->paginate(10)
            ->withQueryString();

        $empresas = Empresa::select('id', 'razonSocial')->orderBy('razonSocial')->get();

        return Inertia::render('Usuarios/Index', [
            'users' => $users,
            'filtroActual' => $buscar,
            'filtroActualEmpresa' => $buscarEmpresa,
            'empresas' => $empresas,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->is_admin) {
            abort(403, 'No tienes permiso para realizar esta acción o ver esta página.');
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|min:8',
            'is_admin' => 'required|boolean',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_admin' => $validated['is_admin'],
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('message', 'Usuario creado con éxito');
    }

    public function update(Request $request, $id)
    {   
        if (!auth()->user()->is_admin) {
            abort(403, 'No tienes permiso para realizar esta acción o ver esta página.');
        }
        $user = User::find($id);
        
        if (!$user) {
            return back()->with('message', 'Usuario no encontrado');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'password' => 'nullable|min:8',
            'is_admin' => 'required|boolean',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_admin' => $validated['is_admin'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }
        
        $user->update($data);

        return back()->with('message', 'Usuario actualizado con éxito');
    }

    public function destroy($id)
    {
        if (!auth()->user()->is_admin) {
            abort(403, 'No tienes permiso para realizar esta acción o ver esta página.');
        }
        $user = User::find($id);
        
        if (!$user) {
            return back()->with('message', 'Usuario no encontrado');
        }

        $user->delete();

        return back()->with('message', 'Usuario eliminado con éxito');
    }
}