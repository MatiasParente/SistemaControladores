<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empresa extends Model
{
    protected $table = 'empresa';

    use HasFactory;

    protected $fillable = [
        'rut',
        'razonSocial',
        'direccion',
        'logo',
    ];

    public function user(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'empresa_usuario', 'idEmpresa', 'user_id')->withTimestamps();
    }

    public function declaracion(): HasMany
    {
        return $this->hasMany(Declaracion::class, 'idEmpresa');
    }
}
