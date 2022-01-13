<?php

use App\Models\Answer;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('answers', function (Blueprint $table) {
            $usersTable = (new User())->getTable();
            $table->id();
            $table->foreignIdFor(User::class, 'student_id')->constrained($usersTable);
            $table->foreignIdFor(User::class, 'faculty_id')->constrained($usersTable);
            $table->foreignIdFor(Question::class)->constrained();
            $table->enum('rating', Answer::RATINGS);
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
        Schema::dropIfExists('answers');
    }
}
