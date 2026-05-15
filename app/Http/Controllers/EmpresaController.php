<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmpresaController extends Controller
{
    public function index()
    {
        // if para si es admin que muestre todas las empresas y si no que muestre solo las de el usuario
        if (Auth::user()->is_admin == false) {
            $empresa = Auth::user()->empresas;
        } else {
            $empresa = Empresa::all();
        }

        // retorna la vista empresas con las empresas
        return Inertia::render('Empresas/Index', [
            'empresas' => $empresa,
        ]);
    }

    // required = obligatorio, //unique = unico
    public function store(Request $request)
    {
        $request->validate([
            'rut' => 'required|unique:empresa',
            'razonSocial' => 'required',
        ]);

        Auth::user()->empresas()->create($request->all());

        return redirect()->back()->with('message', 'Empresa creada con éxito');
    }

    public function destroy($id)
    {
        $user = Auth::user();

        // agregamos un query para buscar la empresa en la base de datos
        $empresa = Empresa::query()->find($id);

        if (! $empresa) {
            return redirect()->back()->with('message', 'Empresa no encontrada');
        }
        $esDuenio = $user->empresas->contains($id);

        if (! $user->is_admin && ! $esDuenio) {
            return redirect()->back()->with('message', 'No tienes permiso para eliminar esta empresa');
        }
        Empresa::destroy($id);

        return redirect()->back()->with('message', 'Empresa eliminada con éxito');
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        // validamos los datos de la empresa para que no ponga datos vacios
        $request->validate([
            'rut' => 'required',
            'razonSocial' => 'required',
        ]);

        $empresa = Empresa::query()->find($id);

        if (! $empresa) {
            return redirect()->back()->with('message', 'Empresa no encontrada');
        }
        $esDuenio = $user->empresas->contains($id);

        if (! $user->is_admin && ! $esDuenio) {
            return redirect()->back()->with('message', 'No tienes permiso para editar esta empresa');
        }
        $empresa->update($request->all());

        return redirect()->back()->with('message', 'Empresa editada con éxito');
    }
}
