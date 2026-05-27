<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Declaracion;

class EmpresaController extends Controller
{
    public function index(Request $request) 
{
    $buscar = $request->buscar;
    $user = Auth::user();
    
    // Consulta base de datos
    $queryEmpresas = $user->empresas()->withCount([
        'declaracion as en_pendiente_count' => function ($query) {
            $query->where('idEstado', 1);
        },
        'declaracion as en_proceso_count' => function ($query) {
            $query->where('idEstado', 2);
        },
        'declaracion as finalizadas_count' => function ($query) {
            $query->where('idEstado', 3);
        },
        'declaracion as rechazadas_count' => function ($query) {
            $query->where('idEstado', 5);
        }
    ]);

    // Buscador por nombre o RUT
    if ($buscar) {
        $queryEmpresas->where(function($query) use ($buscar) {
            $query->where('razonSocial', 'ILIKE', "%{$buscar}%")
                  ->orWhere('rut', 'LIKE', "%{$buscar}%");
        });
    }

    $empresasFiltradas = $queryEmpresas->get(); 
    
    return Inertia::render('Empresas/Index', [
        'empresas' => $user->empresas, 
        'empresasFiltradas' => $empresasFiltradas,
        'filtroActual' => $buscar
    ]);
}


    public function store(Request $request)
    {
        $request->validate([
            'rut' => 'required|unique:empresa',
            'razonSocial' => 'required',
            'direccion' => 'required',
            'logo' => 'nullable|image|max:2048',
        ]);

        $data = $request->except('logo');

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $base64 = base64_encode(file_get_contents($file));
            $mime = $file->getClientMimeType();
            $data['logo'] = 'data:' . $mime . ';base64,' . $base64;
        }

        Auth::user()->empresas()->create($data);

        return redirect()->back()->with('message', 'Empresa creada con éxito');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return redirect()->back()->with('message', 'Empresa no encontrada');
        }
        
        if (!$user->empresas->contains($id)) {
            return redirect()->back()->with('message', 'No tienes permiso para eliminar esta empresa');
        }

        Empresa::destroy($id);
        return redirect()->back()->with('message', 'Empresa eliminada con éxito');
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $request->validate([
            'rut' => 'required',
            'razonSocial' => 'required',
            'direccion' => 'required',
            'logo' => 'nullable|image|max:2048',
        ]);

        $empresa = Empresa::find($id);

        if (!$empresa) {
            return redirect()->back()->with('message', 'Empresa no encontrada');
        }

        if (!$user->empresas->contains($id)) {
            return redirect()->back()->with('message', 'No tienes permiso para editar esta empresa');
        }

        $data = $request->except('logo');

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $base64 = base64_encode(file_get_contents($file));
            $mime = $file->getClientMimeType();
            $data['logo'] = 'data:' . $mime . ';base64,' . $base64;
        }

        $empresa->update($data);
        return redirect()->back()->with('message', 'Empresa editada con éxito');
    }
}