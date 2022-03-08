<?php

use App\Models\Faculty;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('faculty_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Faculty::class)->constrained('users');
            $table->foreignIdFor(Subject::class)->constrained();
            $table->foreignIdFor(Section::class)->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('faculty_subjects');
    }
};
