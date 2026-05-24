<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plantilla', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idDeclaracion')->constrained('declaracion')->onDelete('cascade');
            $table->string('tipoPlantilla');
            $table->string('direccionArchivo'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plantilla');
    }
};
