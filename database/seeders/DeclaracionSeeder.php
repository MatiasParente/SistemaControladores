<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Declaracion;
use App\Models\Empresa;
use App\Models\Estado;

class DeclaracionSeeder extends Seeder {
    public function run(): void {
        $empresa = Empresa::first();
        $estado = Estado::first();

        Declaracion::create([
            'idEmpresa' => $empresa->id,
            'fechaFiscalInicio' => '2022-01-01',
            'fechaFiscalFin' => '2022-12-31',
            'idEstado' => $estado->id,
        ]);
    }
}
