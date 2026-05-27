<?php

namespace App\Http\Controllers;

use App\Models\Plantilla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PlantillaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'idDeclaracion' => 'required|exists:declaracion,id',
            'tipoPlantilla' => 'required|string',
            'archivo' => 'required|file|mimes:xlsx,xls|max:2048',
        ]);

        if ($request->hasFile('archivo')) {
            $ruta = $request->file('archivo')->store('plantillas', 'public');
            $plantilla = Plantilla::create([
                'idDeclaracion' => $request->idDeclaracion,
                'tipoPlantilla' => $request->tipoPlantilla,
                'direccionArchivo' => $ruta,
            ]);
            
            if ($plantilla->declaracion) {
                $plantilla->declaracion->evaluarEstado();
            }
            
            return redirect()->back()->with('message', 'Plantilla subida con éxito.');
        }

        return redirect()->back()->with('error', 'No se ha proporcionado un archivo.');
    }

    public function download($id)
    {
        try {
            $plantilla = Plantilla::findOrFail($id);

            if (!Storage::disk('public')->exists($plantilla->direccionArchivo)) {
                return back()->with('error', 'El archivo físico de la plantilla no se encuentra.');
            }

            return Storage::disk('public')->download($plantilla->direccionArchivo);
        } catch (\Exception $e) {
            return back()->with('error', 'La plantilla solicitada no pudo ser descargada.');
        }
    }

    public function destroy($id)
    {
        $plantilla = Plantilla::find($id);
        if ($plantilla) {
            $declaracion = $plantilla->declaracion;
            
            if (Storage::disk('public')->exists($plantilla->direccionArchivo)) {
                Storage::disk('public')->delete($plantilla->direccionArchivo);
            }
            $plantilla->delete();
            
            if ($declaracion) {
                $declaracion->evaluarEstado();
            }
            
            return redirect()->back()->with('message', 'Plantilla eliminada con éxito.');
        }
        
        return redirect()->back()->with('error', 'Plantilla no encontrada.');
    }
}
