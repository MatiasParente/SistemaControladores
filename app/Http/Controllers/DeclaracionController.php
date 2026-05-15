<?php

namespace App\Http\Controllers;

use App\Models\Declaracion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DeclaracionController extends Controller
{
    public function index()
    {
        if (Auth::user()->is_admin == false) {
            $empresaIds = Auth::user()->empresas->pluck('id')->toArray();
            $declaracion = Declaracion::whereIn('idEmpresa', $empresaIds)->get();
        } else {
            $declaracion = Declaracion::all();
        }

        return Inertia::render('Declaraciones/Index', [
            'declaraciones' => $declaracion,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'idEmpresa' => 'required|exists:empresa,id',
            'fechaFiscalInicio' => 'required|date',
            'fechaFiscalFin' => 'required|date',
            'idEstado' => 'required|exists:estado,id',
            'Original' => 'nullable|file|mimes:xlsx,xls',
            'IRAE' => 'nullable|file|mimes:xlsx,xls',
        ]);

        $declaracion = Declaracion::create($request->all());

        $tipos = ['Original', 'IRAE', 'Patrimonio', 'Balance'];

        foreach ($tipos as $tipo) {
            if ($request->hasFile($tipo)) {
                // Guardamos el archivo físico en storage/app/public/plantillas
                $ruta = $request->file($tipo)->store('plantillas', 'public');
                // Creamos el registro en la tabla de plantillas vinculado a esta declaración
                Plantilla::create([
                    'idDeclaracion' => $declaracion->id,
                    'tipoPlantilla' => $tipo,
                    'direccionArchivo' => $ruta,
                ]);
            }
        }

        return redirect()->back()->with('message', 'Declaracion creada con éxito');
    }

    public function destroy($id)
    {
        $declaracion = Declaracion::query()->find($id);
        if (! $declaracion) {
            return redirect()->back()->with('message', 'Declaracion no encontrada');
        }

        $esDuenio = Auth::user()->empresas->contains($declaracion->idEmpresa);

        if (! Auth::user()->is_admin && ! $esDuenio) {
            return redirect()->back()->with('message', 'No tienes permiso para eliminar esta declaración');
        }

        Declaracion::destroy($id);

        return redirect()->back()->with('message', 'Declaracion eliminada con éxito');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'idEmpresa' => 'required|exists:empresa,id',
            'fechaFiscalInicio' => 'required|date',
            'fechaFiscalFin' => 'required|date',
            'idEstado' => 'required|exists:estado,id',
        ]);

        $declaracion = Declaracion::query()->find($id);
        if (! $declaracion) {
            return redirect()->back()->with('message', 'Declaracion no encontrada');
        }

        $esDuenio = Auth::user()->empresas->contains($declaracion->idEmpresa);

        if (! Auth::user()->is_admin && ! $esDuenio) {
            return redirect()->back()->with('message', 'No tienes permiso para editar esta declaración');
        }

        $declaracion->update($request->all());

        return redirect()->back()->with('message', 'Declaracion actualizada con éxito');
    }

    public function edit($id)
    {
        $declaracion = Declaracion::query()->find($id);
        if (! $declaracion) {
            return redirect()->back()->with('message', 'Declaracion no encontrada');
        }

        $esDuenio = Auth::user()->empresas->contains($declaracion->idEmpresa);
        if (! Auth::user()->is_admin && ! $esDuenio) {
            return redirect()->back()->with('message', 'No tienes permiso para editar esta declaración');
        }

        return Inertia::render('Declaraciones/Edit', [
            'declaracion' => $declaracion,
        ]);
    }
}
