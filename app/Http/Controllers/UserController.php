<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        if (Auth::user()->is_admin == false) {
            $users = User::where('id', Auth::user()->id)->get(); // get() asegura que sea una lista
        } else {
            $users = User::all();
        }

        return Inertia::render('Usuarios/Index', [
            'users' => $users,
        ]);

    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|min:8',
            'is_admin' => 'boolean',
        ]);

        if (Auth::user()->is_admin == false) {
            return redirect()->back()->with('message', 'No tienes permiso para crear usuarios');
        }

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => $validated['is_admin'] ?? false,
        ]);

        return redirect()->back()->with('message', 'Usuario creado con éxito');
    }

    public function destroy($id)
    {
        $user = User::query()->find($id);
        if (! $user) {
            return redirect()->back()->with('message', 'Usuario no encontrado');
        }

        if (! Auth::user()->is_admin) {
            return redirect()->back()->with('message', 'No tienes permiso para eliminar este usuario');
        }

        User::destroy($id);

        return redirect()->back()->with('message', 'Usuario eliminado con éxito');
    }

    public function update(Request $request, $id)
    {
        $user = User::query()->find($id);
        if (! $user) {
            return redirect()->back()->with('message', 'Usuario no encontrado');
        }

        if (! Auth::user()->is_admin) {
            return redirect()->back()->with('message', 'No tienes permiso para editar este usuario');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'password' => 'nullable|min:8',
            'is_admin' => 'boolean',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_admin' => $validated['is_admin'] ?? false,
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }
        $user->update($data);

        return redirect()->back()->with('message', 'Usuario actualizado con éxito');
    }
}
