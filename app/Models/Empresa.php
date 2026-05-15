<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empresa extends Model
{
    use HasFactory;

    protected $fillable = [
        'rut',
        'razonSocial',
        'logo',
    ];

    public function declaracion(): HasMany
    {
        return $this->hasMany(Declaracion::class);
    }

    public function user(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'empresa_usuario')
                    ->withTimestamps();
    }
}