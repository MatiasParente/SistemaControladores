<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Estado;

class EstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Estado::create(['tipoEstado' => 'Pendiente']);
        Estado::create(['tipoEstado' => 'En Proceso']);
        Estado::create(['tipoEstado' => 'Finalizada']);
        Estado::create(['tipoEstado' => 'Rechazada']);
    }
}