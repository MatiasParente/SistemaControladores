<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\DeclaracionController;
use App\Http\Controllers\EstadoController;
use App\Http\Controllers\PlantillaController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/empresas', [EmpresaController::class, 'index'])->name('empresas.index');
    Route::post('/empresas', [EmpresaController::class, 'store'])->name('empresas.store');
    Route::put('/empresas/{id}', [EmpresaController::class, 'update'])->name('empresas.update');
    Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy'])->name('empresas.destroy');

    Route::get('/declaraciones', [DeclaracionController::class, 'index'])->name('declaraciones.index');
    Route::post('/declaraciones', [DeclaracionController::class, 'store'])->name('declaraciones.store');
    Route::put('/declaraciones/{id}', [DeclaracionController::class, 'update'])->name('declaraciones.update');
    Route::delete('/declaraciones/{id}', [DeclaracionController::class, 'destroy'])->name('declaraciones.destroy');

    Route::get('/estados', [EstadoController::class, 'index'])->name('estados.index');
    Route::post('/estados', [EstadoController::class, 'store'])->name('estados.store');
    Route::put('/estados/{id}', [EstadoController::class, 'update'])->name('estados.update');
    Route::delete('/estados/{id}', [EstadoController::class, 'destroy'])->name('estados.destroy');

    Route::get('/plantillas', [PlantillaController::class, 'index'])->name('plantillas.index');
    Route::post('/plantillas', [PlantillaController::class, 'store'])->name('plantillas.store');
    Route::put('/plantillas/{id}', [PlantillaController::class, 'update'])->name('plantillas.update');
    Route::delete('/plantillas/{id}', [PlantillaController::class, 'destroy'])->name('plantillas.destroy');
    Route::get('/plantillas/download/{id}', [PlantillaController::class, 'download'])->name('plantillas.download');

    Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios', [UserController::class, 'store'])->name('usuarios.store');
    Route::put('/usuarios/{id}', [UserController::class, 'update'])->name('usuarios.update');
    Route::delete('/usuarios/{id}', [UserController::class, 'destroy'])->name('usuarios.destroy');
});

require __DIR__.'/auth.php';
