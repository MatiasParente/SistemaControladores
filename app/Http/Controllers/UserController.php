<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {

        $users = User::all();

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
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('message', 'Usuario creado con éxito');
    }

    public function destroy($id)
    {
        $user = User::query()->find($id);
        if (! $user) {
            return redirect()->back()->with('message', 'Usuario no encontrado');
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

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'password' => 'nullable|min:8',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }
        $user->update($data);

        return redirect()->back()->with('message', 'Usuario actualizado con éxito');
    }
}
