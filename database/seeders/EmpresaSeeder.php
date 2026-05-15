<?php

namespace Database\Seeders;

use App\Models\Empresa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $user = User::where('email', 'admin@ejemplo.com')->first();
        $empresa = Empresa::create([
            'rut' => '123456789012',
            'razonSocial' => 'Acme Corporation',
            'direccion' => 'Av. Siempre Viva 742',
            'logo' => 'logo.png',
        ]);
        
        //vinculamos la empresa al usuario
        $user->empresas()->attach($empresa->id);
    }
}
