<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmpresaUsuarioController extends Controller
{
    public function getUsuarios(Request $request, $id)
    {
        $user = Auth::user();
        $empresa = Empresa::findOrFail($id);

        if (!$user->is_admin && !$user->empresas->contains($id)) {
            return response()->json(['message' => 'No tienes permiso para ver los usuarios de esta empresa'], 403);
        }

        $search = $request->input('search');

        $query = $empresa->user(); 

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                ->orWhere('email', 'ILIKE', "%{$search}%")
                ->orWhere('apellido', 'ILIKE', "%{$search}%");
            });
        }

        $usuarios = $query->select('users.id', 'users.name', 'users.email')->orderBy('users.name')->paginate(10);

        return response()->json($usuarios);
    }

    public function getEmpresas(Request $request, $id){
        $user = Auth::user(); 
        $targetUser = User::findOrFail($id); // Obtenemos el usuario del cual queremos ver las empresas

        // Si no es admin y tampoco es su propio perfil
        if(!$user->is_admin && $user->id !== $targetUser->id){
            return response()->json(['message' => 'No tienes permiso para ver las empresas de este usuario'], 403);
        }

        $search = $request->input('search');
        $query = $targetUser->empresas(); // Asumiendo que la relación en el modelo User es "empresas()"
        
        if($search){
            $query->where(function($q) use($search) {
                // Las columnas reales de la base de datos suelen ser las que definiste en el otro controlador
                $q->where('razonSocial', 'ILIKE', "%{$search}%") 
                  ->orWhere('rut', 'ILIKE', "%{$search}%"); 
            });
        }

        $empresas = $query->select('empresa.id', 'empresa.razonSocial', 'empresa.rut')->orderBy('empresa.razonSocial')->paginate(10); 
        return response()->json($empresas);
    }
}
