<?php

namespace App\Http\Controllers;

use App\Models\Declaracion;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\Plantilla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DeclaracionController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        

        $estadoFinalizada = Estado::where('tipoEstado', 'Finalizada')->first();
        $estadoPendiente = Estado::where('tipoEstado', 'Pendiente')->first();
        $estadoEnProceso = Estado::where('tipoEstado', 'En Proceso')->first();
        $estadoEliminado = Estado::where('tipoEstado', 'Eliminado')->first();

        $currentYear = now()->year; 

        $queryStats = Declaracion::query()
            ->whereYear('fechaFiscalInicio', $currentYear)
            ->when($estadoEliminado, function($q) use ($estadoEliminado) {
                return $q->where('idEstado', '!=', $estadoEliminado->id);
            });

            if (!$user->is_admin) {
                $queryStats->whereIn('idEmpresa', $user->empresas->pluck('id'));
            }
        
        $stats = [
            'total' => $queryStats->count(),
            'pendientes' => (clone $queryStats)->where('idEstado', $estadoPendiente ? $estadoPendiente->id : 0)->count(),
            'enProceso' => (clone $queryStats)->where('idEstado', $estadoEnProceso ? $estadoEnProceso->id : 0)->count(),
            'finalizadas' => (clone $queryStats)->where('idEstado', $estadoFinalizada ? $estadoFinalizada->id : 0)->count(),
        ];

        $total = $stats['pendientes'] + $stats['enProceso'] + $stats['finalizadas'];
        $totalEmpresas = Empresa::count();

        $atencionesPaginadas = Declaracion::with(['empresa', 'plantillas'])
            ->whereYear('fechaFiscalInicio', $currentYear)
            ->has('empresa') 
            ->when($estadoEliminado, function($q) use ($estadoEliminado) {
                return $q->where('idEstado', '!=', $estadoEliminado->id);
            })
            ->when(!$user->is_admin, function($query) use ($user) {
                $query->whereIn('idEmpresa', $user->empresas->pluck('id'));
            })
            ->where(function($query) {
                $query->doesntHave('plantillas')
                    ->orWhereHas('plantillas', function($q) {}, '<', 4);
            })
            ->latest()
            ->paginate(3, ['*'], 'page_atenciones')
            ->withQueryString();

        $planillasRequeridas = ['Original', 'IRAE', 'Patrimonio', 'Balance'];

        $atencionesPaginadas->through(function ($declaracion) use ($planillasRequeridas) {
            $existentes = $declaracion->plantillas->pluck('tipoPlantilla')->toArray();
            $faltantes = array_diff($planillasRequeridas, $existentes);
        
            return [
                'empresa' => $declaracion->empresa,
                'declaracion' => $declaracion,
                'faltantes' => array_values($faltantes)
            ];
        });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'totalEmpresas' => $totalEmpresas,
            'atenciones' => $atencionesPaginadas,
            'total' => $total,
        ]);
    }

    public function index(Request $request)
    {
        $buscar = $request->input('buscar');
        $buscarEstado = $request->input('buscarEstado');
        $buscarAño = $request->input('buscarAño');

        $query = Declaracion::with(['empresa', 'estado', 'plantillas'])->latest();
        
        $user = auth()->user();
        if (!$user->is_admin) {
            //obtenemos los IDs de las empresas asignadas al usuario
            $empresasIds = $user->empresas->pluck('id');
            //filtro para que solo traiga las declaraciones de esas empresas
            $query->whereIn('idEmpresa', $empresasIds);
        }

        $estadoEliminado = Estado::where('tipoEstado', 'Eliminado')->first();

        if ($estadoEliminado) {
            if ($buscarEstado == $estadoEliminado->id) {
                $query->where('idEstado', $estadoEliminado->id);
            } else {
                $query->where('idEstado', '!=', $estadoEliminado->id);
                if ($buscarEstado) {
                    $query->where('idEstado', $buscarEstado);
                }
            }
        } elseif ($buscarEstado) {
            $query->where('idEstado', $buscarEstado);
        }

        if ($buscar) {
            $query->whereHas('empresa', function($q) use ($buscar) {
                $q->where('razonSocial', 'ILIKE', "%{$buscar}%")
                    ->orWhere('rut', 'LIKE', "%{$buscar}%");
            });
        }

        if ($buscarAño) {
            $query->whereYear('fechaFiscalInicio', $buscarAño); 
        }

        $declaracion = $query->paginate(6)->withQueryString();
        
        $queryStats = Declaracion::query()->when($estadoEliminado, function($q) use ($estadoEliminado) {
            return $q->where('idEstado', '!=', $estadoEliminado->id);
        });

        if (!$user->is_admin) {
            $queryStats->whereIn('idEmpresa', $user->empresas->pluck('id'));
        }

        $estadoFinalizada = Estado::where('tipoEstado', 'Finalizada')->first();
        $estadoPendiente = Estado::where('tipoEstado', 'Pendiente')->first();
        $estadoEnProceso = Estado::where('tipoEstado', 'En Proceso')->first();

        $stats = [
            'total' => $queryStats->count(),
            'finalizadas_mes' => (clone $queryStats)->where('idEstado', $estadoFinalizada ? $estadoFinalizada->id : 0)->whereMonth('updated_at', now()->month)->whereYear('updated_at', now()->year)->count(),
            'pendientes' => (clone $queryStats)->where('idEstado', $estadoPendiente ? $estadoPendiente->id : 0)->count(),
            'enProceso' => (clone $queryStats)->where('idEstado', $estadoEnProceso ? $estadoEnProceso->id : 0)->count(),
            'finalizadas' => (clone $queryStats)->where('idEstado', $estadoFinalizada ? $estadoFinalizada->id : 0)->count(),
        ];

        $total = $stats['pendientes'] + $stats['enProceso'] + $stats['finalizadas'];
        $empresas = Empresa::latest()->get();
        $estados = Estado::all();

        return Inertia::render('Declaraciones/Index', [
            'declaraciones' => $declaracion,
            'filtroActual' => $buscar,
            'filtroActualEstado' => $buscarEstado,
            'filtroActualAño' => $buscarAño,
            'empresas' => $empresas,
            'estados' => $estados,
            'stats' => $stats,
            'total' => $total,
        ]);
    }

    public function destroy($id)
    {
        $declaracion = Declaracion::find($id);
        
        if (!$declaracion) {
            return redirect()->back()->with('message', 'Declaración no encontrada');
        }

        $estadoEliminado = Estado::where('tipoEstado', 'Eliminado')->first();

        // Si la declaración ya tenia estado Eliminado, se borra permanentemente
        if ($estadoEliminado && $declaracion->idEstado == $estadoEliminado->id) {
            $declaracion->delete();
            return redirect()->back()->with('message', 'Declaración eliminada permanentemente');
        } 
        //Cualquier otro estado no se elimina permantete solo cambia el estado
        if ($estadoEliminado) {
            $declaracion->idEstado = $estadoEliminado->id;
            $declaracion->save();
            return redirect()->back()->with('message', 'Declaración enviada a la papelera');
        }

        $declaracion->delete();
        return redirect()->back()->with('message', 'Declaración eliminada de la base de datos');
    }

    public function restaurar(Request $request, $id)
    {
        $declaracion = Declaracion::find($id);
        
        if (!$declaracion) {
            return redirect()->back()->with('message', 'Declaración no encontrada');
        }

        $declaracion->evaluarEstado(); 
        $declaracion->save(); 

        return redirect()->back()->with('message', 'Declaración recuperada con éxito');
    }

    public function store(Request $request)
    {
        $request->validate([
            'idEmpresa' => 'required|exists:empresa,id',
            'fechaFiscalInicio' => 'required|date',
            'fechaFiscalFin' => 'required|date',
            'idEstado' => 'required|exists:estado,id',
            'Original' => 'nullable|file|mimes:xlsx,xls',
            'IRAE' => 'nullable|file|mimes:xlsx,xls',
            'Patrimonio' => 'nullable|file|mimes:xlsx,xls',
            'Balance' => 'nullable|file|mimes:xlsx,xls',
        ]);

        $declaracion = Declaracion::create($request->all());

        $tipos = ['Original', 'IRAE', 'Patrimonio', 'Balance'];

        foreach ($tipos as $tipo) {
            if ($request->hasFile($tipo)) {
                $ruta = $request->file($tipo)->store('plantillas', 'public');
                Plantilla::create([
                    'idDeclaracion' => $declaracion->id,
                    'tipoPlantilla' => $tipo,
                    'direccionArchivo' => $ruta,
                ]);
            }
        }

        $declaracion->evaluarEstado();

        return redirect()->back()->with('message', 'Declaración creada con éxito');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'idEmpresa' => 'required|exists:empresa,id',
            'fechaFiscalInicio' => 'required|date',
            'fechaFiscalFin' => 'required|date',
            'idEstado' => 'required|exists:estado,id',
        ]);

        $declaracion = Declaracion::find($id);
        
        if (!$declaracion) {
            return redirect()->back()->with('message', 'Declaración no encontrada');
        }

        $declaracion->update($request->all());

        return redirect()->back()->with('message', 'Declaración actualizada con éxito');
    }

    public function edit($id)
    {
        $declaracion = Declaracion::find($id);
        
        if (!$declaracion) {
            return redirect()->back()->with('message', 'Declaración no encontrada');
        }

        return Inertia::render('Declaraciones/Edit', [
            'declaracion' => $declaracion,
        ]);
    }
}