<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Declaracion extends Model
{
    use HasFactory;

    protected $table = 'declaracion';

    protected $fillable = [
        'idEmpresa',
        'fechaFiscalInicio',
        'fechaFiscalFin',
        'idEstado',
    ];

    protected $casts = [
        'fechaFiscalInicio' => 'date',
        'fechaFiscalFin' => 'date',
    ];

    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'idEmpresa');
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(Estado::class, 'idEstado');
    }

    public function plantillas(): HasMany
    {
        return $this->hasMany(Plantilla::class, 'idDeclaracion');
    }

    public function evaluarEstado()
    {
        if ($this->estado && $this->estado->tipoEstado === 'Rechazada') {
            return;
        }

        $count = $this->plantillas()->count();
        $tipoEstado = 'Pendiente';
        
        if ($count >= 4) {
            $tipoEstado = 'Finalizada';
        } elseif ($count > 0) {
            $tipoEstado = 'En Proceso';
        }

        $nuevoEstado = Estado::where('tipoEstado', $tipoEstado)->first();
        if ($nuevoEstado && $this->idEstado !== $nuevoEstado->id) {
            $this->idEstado = $nuevoEstado->id;
            $this->save();
        }
    }
}
