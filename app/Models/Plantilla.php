<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Plantilla extends Model
{
    use HasFactory;

    protected $table = 'plantilla';

    protected $fillable = [
        'idDeclaracion',
        'tipoPlantilla',
        'direccionArchivo',
    ];

    public function declaracion(): BelongsTo
    {
        return $this->belongsTo(Declaracion::class, 'idDeclaracion');
    }
}
