<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description'
    ];

    protected static function booted()
    {
        static::deleting(fn (self $subject) => $subject->facultySubjects->each->delete());
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_subject')
            ->where('role', User::STUDENT)
            ->withTimestamps();
    }

    public function facultySubjects()
    {
        return $this->hasMany(FacultySubject::class);
    }
}
