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
    Schema::create('declaracion', function (Blueprint $table) {
        $table->id();
        $table->foreignId('idEmpresa')->constrained('empresa')->onDelete('cascade');
        $table->date('fechaFiscalInicio');
        $table->date('fechaFiscalFin');
        $table->foreignId('idEstado')->constrained('estado');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('declaracion');
    }
};
