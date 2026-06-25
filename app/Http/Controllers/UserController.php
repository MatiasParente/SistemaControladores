<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        // aca definimos los middleware que se ejecutaran antes de cualquier metodo del controlador
        //es la forma correcta de hacerlo en laravel 11 para los controladores que implementan HasMiddleware
        // se pone esto si queremos que el usuario comun no pueda acceder a estos metodos
        return [
            new Middleware(function ($request, $next) {
                if (!auth()->check() || !auth()->user()->is_admin) {
                    abort(403, 'Acceso denegado. Se requiere rol de administrador.');
                }
                return $next($request);
            })
        ];
    }

    public function index(Request $request)
    {  

        $buscar = $request->input('buscar'); // capturamos el parametro de busqueda, en el frontend envia el parametro buscar
        $buscarEmpresa = $request->input('buscarEmpresa'); // capturamos el parametro de busqueda de empresa

        $users = User::query() // inicializamos la consulta
            ->with(['empresas']) // cargamos la relacion con empresas
            ->latest() // ordenamos por fecha de creacion
            ->when($buscar, function ($query) use ($buscar) { // si existe el parametro de busqueda, aplicamos un filtro
                $query->where(function ($q) use ($buscar) {
                    $q->where('name', 'ILIKE', "%{$buscar}%") // buscamos por nombre
                    ->orWhere('email', 'ILIKE', "%{$buscar}%"); // o por email
                });
            })
            ->when($buscarEmpresa, function ($query) use ($buscarEmpresa) { // si existe el parametro de busqueda de empresa, aplicamos un filtro
                $query->whereHas('empresas', function ($q) use ($buscarEmpresa) { // filtramos por empresa
                    $q->where('empresa.id', $buscarEmpresa);
                });
            })
            ->paginate(10) // paginamos los resultados en bloques de 10
            ->withQueryString(); // mantenemos los parametros de busqueda en la url

        $empresas = Empresa::select('id', 'razonSocial')->orderBy('razonSocial')->get(); // obtenemos todas las empresas para el select

        return Inertia::render('Usuarios/Index', [ // renderizamos la vista Usuarios/Index con los datos de las variables
            'users' => $users, // enviamos los usuarios
            'filtroActual' => $buscar, // enviamos el filtro actual
            'filtroActualEmpresa' => $buscarEmpresa, // enviamos el filtro actual de empresa
            'empresas' => $empresas, // enviamos las empresas
        ]);
    }

    public function store(Request $request)
    {
        // validamos los datos que vienen del formulario de creacion de usuarios
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|min:8',
            'is_admin' => 'required|boolean',
        ]);
        // creamos el usuario
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_admin' => $validated['is_admin'],
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('message', 'Usuario creado con éxito');
    }

    public function update(Request $request, $id)
    {   

        
        $user = User::find($id);
        
        if (!$user) {
            return back()->with('message', 'Usuario no encontrado');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'password' => 'nullable|min:8',
            'is_admin' => 'required|boolean',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_admin' => $validated['is_admin'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->empresas()->sync($request->input('empresas_ids', []));
        $user->update($data);

        return back()->with('message', 'Usuario actualizado con éxito');
    }

    public function destroy($id)
    {

        $user = User::find($id);
        
        if (!$user) {
            return back()->with('message', 'Usuario no encontrado');
        }

        $user->delete();

        return back()->with('message', 'Usuario eliminado con éxito');
    }
    public function restaurarContraseña($id)
    {
        $user = User::findOrFail($id); // buscamos el usuario por id, findOrFail lanza una excepcion si no encuentra el usuario
        //creamos una contraseña temporal aleatoria para que se la pase al usuario
        $nuevaContraseñaTemporal = Str::random(8); // generamos una contraseña temporal aleatoria de 8 caracteres
        $user->password = Hash::make($nuevaContraseñaTemporal); // encriptamos la contraseña temporal
        $user->save(); // guardamos el usuario
        return back()->with('message', "Contraseña restaurada. Nueva contraseña: " . $nuevaContraseñaTemporal); // retornamos la contraseña temporal
    }
}
