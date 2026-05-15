<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Declaracion extends Model
{
    use HasFactory;

    protected $table = 'declaraciones';

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
        return $this->belongsTo(Empresa::class);
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(Estado::class);
    }

    public function plantillas(): HasMany
    {
        return $this->hasMany(Plantilla::class);
    }
}