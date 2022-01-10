<?php

use App\Models\AcademicYear;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $usersTable = (new User())->getTable();
            $table->id();
            $table->foreignIdFor(AcademicYear::class)->constrained();
            $table->foreignIdFor(User::class, 'student_id')->constrained($usersTable);
            $table->foreignIdFor(User::class, 'faculty_id')->constrained($usersTable);
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
        Schema::dropIfExists('evaluations');
    }
}
