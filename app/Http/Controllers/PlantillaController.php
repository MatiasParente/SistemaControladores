<?php

namespace App\Http\Controllers;

use App\Models\Plantilla;
use Illuminate\Support\Facades\Storage;

class PlantillaController extends Controller
{
    public function download($id)
    {
        // busca la plantilla y sino da error 404
        $plantilla = Plantilla::findOrFail($id);

        return Storage::download($plantilla->direccionArchivo);
    }
}
