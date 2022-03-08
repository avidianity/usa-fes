<?php

namespace App\Models;

use App\Models\User as Model;

class Student extends Model
{
    protected $table = 'users';

    const ROLE = self::STUDENT;

    public function answers()
    {
        return $this->hasMany(Answer::class, 'student_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'student_subject', 'user_id')
            ->withTimestamps();
    }
}
