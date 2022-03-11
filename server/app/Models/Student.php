<?php

namespace App\Models;

use App\Models\User as Model;

class Student extends Model
{
    protected $table = 'users';

    const ROLE = self::STUDENT;

    protected static function booted()
    {
        static::deleting(function (self $student) {
            $student->subjects()->detach();
            $student->answers->each->delete();
        });
    }

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
