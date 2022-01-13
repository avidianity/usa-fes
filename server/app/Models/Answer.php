<?php

namespace App\Models;

use App\Scopes\RoleAnswerScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    const RATINGS = [
        1, 2, 3, 4, 5
    ];

    protected $fillable = [
        'faculty_id',
        'student_id',
        'question_id',
        'rating'
    ];

    protected $casts = [
        'rating' => 'integer'
    ];

    protected static function booted()
    {
        static::addGlobalScope(new RoleAnswerScope());
    }

    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
