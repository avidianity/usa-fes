<?php

namespace App\Models;

use App\Models\User as Model;

class Faculty extends Model
{
    protected $table = 'users';

    const ROLE = self::FACULTY;

    protected static function booted()
    {
        static::deleting(function (self $faculty) {
            $faculty->answers->each->delete();
            $faculty->evaluations->each->delete();
            $faculty->subjects->each->delete();
        });
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'faculty_id');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'faculty_id');
    }

    public function subjects()
    {
        return $this->hasMany(FacultySubject::class);
    }
}
