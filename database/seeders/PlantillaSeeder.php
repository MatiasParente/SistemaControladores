<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Plantilla;
use App\Models\Declaracion;

class PlantillaSeeder extends Seeder {
    public function run(): void {
        // 1. Buscamos la primera declaración que se creó
        $declaracion = Declaracion::first();

        // 2. Creamos las plantillas vinculadas a esa declaración
        Plantilla::create([
            'idDeclaracion' => $declaracion->id,
            'tipoPlantilla' => 'Original',
            'direccionArchivo' => 'Original.xlsx'
        ]);

        Plantilla::create([
            'idDeclaracion' => $declaracion->id,
            'tipoPlantilla' => 'IRAE',
            'direccionArchivo' => 'IRAE.xlsx'
        ]);
    }
}

