<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'level',
        'section'
    ];

    protected $appends = [
        'title'
    ];

    protected static function booted()
    {
        static::deleting(fn (self $section) => [
            $section->users->each->delete(),
            $section->facultySubjects->each->delete(),
        ]);
    }

    public function getTitleAttribute()
    {
        return sprintf('%s %s-%s', $this->attributes['name'], $this->attributes['level'], $this->attributes['section']);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function facultySubjects()
    {
        return $this->hasMany(FacultySubject::class);
    }
}
