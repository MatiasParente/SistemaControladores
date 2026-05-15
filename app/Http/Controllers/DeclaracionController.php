<?php

namespace App\Http\Controllers;

use App\Models\Declaracion;
use App\Models\Plantilla;
use Illuminate\Http\Request;

class DeclaracionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'empresa_id' => 'required|exists:empresas,id',
            'fechaFiscalInicio' => 'required|date',
            'fechaFiscalFin' => 'required|date',
            'estado_id' => 'required|exists:estados,id',
        ]);

        $declaracion = Declaracion::create($request->all());

        // Handle the 4 specific Excel files
        $tipos = ['Original', 'IRAE', 'Patrimonio', 'Balance'];

        foreach ($tipos as $tipo) {
            if ($request->hasFile($tipo)) {
                $path = $request->file($tipo)->store('plantillas', 'public');
                
                Plantilla::create([
                    'declaracion_id' => $declaracion->id,
                    'tipoPlantilla' => $tipo,
                    'direccionArchivo' => $path
                ]);
            }
        }

        return redirect()->back();
    }
}