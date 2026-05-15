<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estado extends Model
{
    use HasFactory;

    protected $fillable = ['tipoEstado'];

    public function declaracion(): HasMany
    {
        return $this->hasMany(Declaracion::class);
    }
}