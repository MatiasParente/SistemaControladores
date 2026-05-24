<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Declaracion;
use App\Models\Empresa;
use App\Models\Estado;

class DeclaracionSeeder extends Seeder {
    public function run(): void {
        // Obtenemos las empresas y estados en colecciones para repartirlos
        $empresas = Empresa::all();
        $estados = Estado::all();

        Declaracion::create([
            'idEmpresa' => $empresas[0]->id,
            'fechaFiscalInicio' => '2025-01-01',
            'fechaFiscalFin' => '2025-12-31',
            'idEstado' => $estados[0]->id, 
        ]);

        Declaracion::create([
            'idEmpresa' => $empresas[1]->id,
            'fechaFiscalInicio' => '2026-01-01',
            'fechaFiscalFin' => '2026-03-31',
            'idEstado' => $estados[1]->id,
        ]);

        Declaracion::create([
            'idEmpresa' => $empresas[2]->id,
            'fechaFiscalInicio' => '2025-06-01',
            'fechaFiscalFin' => '2025-11-30',
            'idEstado' => $estados[2]->id,
        ]);

        Declaracion::create([
            'idEmpresa' => $empresas[3]->id,
            'fechaFiscalInicio' => '2026-01-01',
            'fechaFiscalFin' => '2026-04-30',
            'idEstado' => $estados[3]->id,
        ]);

        Declaracion::create([
            'idEmpresa' => $empresas[4]->id,
            'fechaFiscalInicio' => '2025-01-01',
            'fechaFiscalFin' => '2025-12-31',
            'idEstado' => $estados[4]->id,
        ]);
    }
}