<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plantilla;
use App\Models\Declaracion;

class PlantillaSeeder extends Seeder {
    public function run(): void {
        $declaraciones = Declaracion::all();
        Plantilla::create([
            'idDeclaracion' => $declaraciones[0]->id,
            'tipoPlantilla' => 'Original',
            'direccionArchivo' => 'Original_Acme.xlsx'
        ]);
        Plantilla::create([
            'idDeclaracion' => $declaraciones[0]->id,
            'tipoPlantilla' => 'IRAE',
            'direccionArchivo' => 'IRAE_Acme.xlsx'
        ]);
        
        Plantilla::create([
            'idDeclaracion' => $declaraciones[1]->id,
            'tipoPlantilla' => 'Original',
            'direccionArchivo' => 'Original_Globex.xlsx'
        ]);
        
        Plantilla::create([
            'idDeclaracion' => $declaraciones[2]->id,
            'tipoPlantilla' => 'Complementaria',
            'direccionArchivo' => 'Complementaria_Initech.xlsx'
        ]);
        
        Plantilla::create([
            'idDeclaracion' => $declaraciones[3]->id,
            'tipoPlantilla' => 'IRAE',
            'direccionArchivo' => 'IRAE_Umbrella.xlsx'
        ]);
        
        Plantilla::create([
            'idDeclaracion' => $declaraciones[4]->id,
            'tipoPlantilla' => 'Revisión Técnica',
            'direccionArchivo' => 'Revision_Hooli.xlsx'
        ]);
    }
}