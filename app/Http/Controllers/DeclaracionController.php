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
        
        $estadoRechazada = Estado::where('tipoEstado', 'Rechazada')->first();
        $estadoFinalizada = Estado::where('tipoEstado', 'Finalizada')->first();
        $estadoPendiente = Estado::where('tipoEstado', 'Pendiente')->first();
        $estadoEnProceso = Estado::where('tipoEstado', 'En Proceso')->first();

        $query = Declaracion::with(['empresa', 'estado', 'plantillas'])->latest();
        $queryStats = Declaracion::query();
        
        if ($estadoRechazada) {
            $query->where('idEstado', '!=', $estadoRechazada->id);
            $queryStats->where('idEstado', '!=', $estadoRechazada->id);
        }

        $empresas = Empresa::all();
        
        $stats = [
            'total' => $queryStats->count(),
            'pendientes' => (clone $queryStats)
                ->where('idEstado', $estadoPendiente ? $estadoPendiente->id : 0)
                ->count(),
            'enProceso' => (clone $queryStats)
                ->where('idEstado', $estadoEnProceso ? $estadoEnProceso->id : 0)
                ->count(),
            'finalizadas' => (clone $queryStats)
                ->where('idEstado', $estadoFinalizada ? $estadoFinalizada->id : 0)
                ->count(),
        ];

        $pendientes = $stats['pendientes'];
        $enProceso = $stats['enProceso'];
        $finalizadas = $stats['finalizadas'];

        $total = $pendientes + $enProceso + $finalizadas;
        
        $declaraciones = clone $query;
        $declaraciones = $declaraciones->get();

        return Inertia::render('Dashboard', [
            'declaraciones' => $declaraciones,
            'declaracionesRecientes' => (clone $query)->take(5)->get(),
            'stats' => $stats,
            'empresas' => $empresas,
            'total' => $total,
        ]);
    }

    public function index(Request $request)
    {
        $buscar = $request->input('buscar');
        $buscarEstado = $request->input('buscarEstado');
        $buscarAño = $request->input('buscarAño');

        $query = Declaracion::with(['empresa', 'estado', 'plantillas'])->latest();

    if ($buscar) {
        $query->whereHas('empresa', function($q) use ($buscar) {
            $q->where('razonSocial', 'ILIKE', "%{$buscar}%")
                ->orWhere('rut', 'LIKE', "%{$buscar}%");
        });
    }

    $estadoFinalizada = Estado::where('tipoEstado', 'Finalizada')->first();
    $estadoPendiente = Estado::where('tipoEstado', 'Pendiente')->first();
    $estadoRechazada = Estado::where('tipoEstado', 'Rechazada')->first();
    $estadoEnProceso = Estado::where('tipoEstado', 'En Proceso')->first();

    if ($buscarEstado) {
        $query->where('idEstado', $buscarEstado);
    } elseif ($estadoRechazada) {
        $query->where('idEstado', '!=', $estadoRechazada->id);
    }

    if ($buscarAño) {
        $query->whereYear('fechaFiscalInicio', $buscarAño); 
    }

    $declaracion = $query->get();
    
    $user = Auth::user();
        
    $queryStats = Declaracion::query();

    if ($estadoRechazada) {
        $queryStats->where('idEstado', '!=', $estadoRechazada->id);
    }
        
    $empresas = Empresa::all();

        $estados = Estado::all();

        $stats = [
            'total' => $queryStats->count(),
            'finalizadas_mes' => (clone $queryStats)
                ->where('idEstado', $estadoFinalizada ? $estadoFinalizada->id : 0)
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->count(),
            'pendientes' => (clone $queryStats)
                ->where('idEstado', $estadoPendiente ? $estadoPendiente->id : 0)
                ->count(),
            'enProceso' => (clone $queryStats)
                ->where('idEstado', $estadoEnProceso ? $estadoEnProceso->id : 0)
                ->count(),
            'finalizadas' => (clone $queryStats)
                ->where('idEstado', $estadoFinalizada ? $estadoFinalizada->id : 0)
                ->count(),
        ];

        $pendientes=$stats['pendientes'];
        $enProceso=$stats['enProceso'];
        $finalizadas=$stats['finalizadas'];

        $total=$pendientes+$enProceso+$finalizadas;
    
        $declaracionesRecientes = (clone $queryStats)->with(['empresa', 'estado'])->latest()->take(5)->get();

        return Inertia::render('Declaraciones/Index', [
        'declaraciones' => $declaracion,
        'filtroActual' => $buscar,
        'filtroActualEstado' => $buscarEstado,
        'filtroActualAño' => $buscarAño,
        'empresas' => $empresas,
        'estados' => $estados,
        'stats' => $stats,
        'total' => $total,
        'declaracionesRecientes' => $declaracionesRecientes,
        ]);
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
                // Guardamos el archivo físico en storage/app/public/plantillas
                $ruta = $request->file($tipo)->store('plantillas', 'public');
                // Creamos el registro en la tabla de plantillas vinculado a esta declaración
                Plantilla::create([
                    'idDeclaracion' => $declaracion->id,
                    'tipoPlantilla' => $tipo,
                    'direccionArchivo' => $ruta,
                ]);
            }
        }

        $declaracion->evaluarEstado();

        return redirect()->back()->with('message', 'Declaracion creada con éxito');
    }

    public function destroy($id)
    {
        $declaracion = Declaracion::query()->find($id);
        if (! $declaracion) {
            return redirect()->back()->with('message', 'Declaracion no encontrada');
        }

        $estadoRechazada = Estado::where('tipoEstado', 'Rechazada')->first();
        if ($estadoRechazada) {
            $declaracion->idEstado = $estadoRechazada->id;
            $declaracion->save();
        } else {
            Declaracion::destroy($id);
        }

        return redirect()->back()->with('message', 'Declaracion eliminada con éxito');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'idEmpresa' => 'required|exists:empresa,id',
            'fechaFiscalInicio' => 'required|date',
            'fechaFiscalFin' => 'required|date',
            'idEstado' => 'required|exists:estado,id',
        ]);

        $declaracion = Declaracion::query()->find($id);
        if (! $declaracion) {
            return redirect()->back()->with('message', 'Declaracion no encontrada');
        }


        $declaracion->update($request->all());

        return redirect()->back()->with('message', 'Declaracion actualizada con éxito');
    }

    public function edit($id)
    {
        $declaracion = Declaracion::query()->find($id);
        if (! $declaracion) {
            return redirect()->back()->with('message', 'Declaracion no encontrada');
        }


        return Inertia::render('Declaraciones/Edit', [
            'declaracion' => $declaracion,
        ]);
    }
}
