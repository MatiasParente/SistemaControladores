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

        $empresas = [
            [
                'rut' => '123456789012',
                'razonSocial' => 'Acme Corporation',
                'direccion' => 'Av. Siempre Viva 742',
                'logo' => 'logo_acme.png',
            ],
            [
                'rut' => '987654321098',
                'razonSocial' => 'Globex Corporation',
                'direccion' => 'Ruta Interbalnearia Km 25',
                'logo' => 'logo_globex.png',
            ],
            [
                'rut' => '456789123456',
                'razonSocial' => 'Initech SRL',
                'direccion' => 'Calle Falsa 123',
                'logo' => 'logo_initech.png',
            ],
            [
                'rut' => '321654987321',
                'razonSocial' => 'Umbrella Corp',
                'direccion' => 'Av. de las Américas 4500',
                'logo' => 'logo_umbrella.png',
            ],
            [
                'rut' => '789123456789',
                'razonSocial' => 'Hooli Latinoamericana',
                'direccion' => 'Bulevar Artigas 1122',
                'logo' => 'logo_hooli.png',
            ],
        ];

        foreach ($empresas as $datosEmpresa) {
            $empresa = Empresa::create($datosEmpresa);
            // Vinculamos cada empresa al usuario
            $user->empresas()->attach($empresa->id);
        }
    }
}