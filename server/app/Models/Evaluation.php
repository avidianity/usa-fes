<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @internal
 * Created when a student evaluates a faculty each academic year. Eg: Student has answers for questions
 * for faculty for a academic year
 */
class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'student_id',
        'faculty_id',
        'comments'
    ];

    public function year()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
