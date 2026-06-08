<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Declaracion;
use App\Models\User;
use Illuminate\Support\Facades\File;

class EmpresaController extends Controller
{
    public function index(Request $request) 
    {
        $buscar = $request->buscar;
        $user = Auth::user();
        
        if ($user->is_admin) {
            $queryEmpresas = Empresa::withCount([
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
    } else {
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
    }

        if ($buscar) {
            $queryEmpresas->where(function($query) use ($buscar) {
                $query->where('razonSocial', 'ILIKE', "%{$buscar}%")
                ->orWhere('rut', 'ILIKE', "%{$buscar}%")
                ->orWhere('direccion', 'ILIKE', "%{$buscar}%");
            });
        }
        $empresas = $queryEmpresas->with(['user'])->latest()->paginate(5)->withQueryString(); 
        $usuarios = User::select('id', 'name', 'email')->orderBy('name')->get();
        
        return Inertia::render('Empresas/Index', [
            'empresas' => $empresas,
            'filtroActual' => $buscar,
            'usuarios' => $usuarios,
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
            
            //limpiamos el nombre original de espacios en blanco para evitar problemas en las URLs
            $nombreOriginal = str_replace(' ', '_', $file->getClientOriginalName());
            
            //combinamos un prefijo de tiempo corto con el nombre original
            $nombreArchivo = time() . '_' . $nombreOriginal;
    
            $file->move(public_path('store'), $nombreArchivo);
            $data['logo'] = 'store/' . $nombreArchivo;
        }

        Auth::user()->empresas()->create($data);

        return redirect()->back()->with('message', 'Empresa creada con éxito');
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

        if (!$user->is_admin && !$user->empresas->contains($id)) {
            return redirect()->back()->with('message', 'No tienes permiso para editar esta empresa');
        }

        $data = $request->except('logo');

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $nombreArchivo = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // si la empresa ya tenía un logo viejo guardado en disco, lo borramos
            if (!empty($empresa->logo) && File::exists(public_path($empresa->logo))) {
                File::delete(public_path($empresa->logo));
            }

            //guardamos el nuevo archivo en /public/store
            $file->move(public_path('store'), $nombreArchivo);
            $data['logo'] = 'store/' . $nombreArchivo;
        }

        $empresa->update($data);
        return redirect()->back()->with('message', 'Empresa editada con éxito');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return redirect()->back()->with('message', 'Empresa no encontrada');
        }
        
        if (!$user->is_admin && !$user->empresas->contains($id)) {
            return redirect()->back()->with('message', 'No tienes permiso para eliminar esta empresa');
        }

        if (!empty($empresa->logo) && File::exists(public_path($empresa->logo))) {
            File::delete(public_path($empresa->logo));
        }

        Empresa::destroy($id);
        return redirect()->back()->with('message', 'Empresa eliminada con éxito');
    }
}