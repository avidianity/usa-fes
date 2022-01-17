<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

class AcademicYear extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'semester',
        'active',
        'status'
    ];

    protected $casts = [
        'active' => 'boolean'
    ];

    const FIRST_SEMESTER = '1st';
    const SECOND_SEMESTER = '2nd';
    const SUMMER_SEMESTER = 'Summer';

    const SEMESTERS = [
        self::FIRST_SEMESTER,
        self::SECOND_SEMESTER,
        self::SUMMER_SEMESTER
    ];

    const EVALUATION_CLOSED = 'Closed';
    const EVALUATION_PENDING = 'Pending';
    const EVALUATION_ONGOING = 'Ongoing';

    const EVALUATION_STATUSES = [
        self::EVALUATION_CLOSED,
        self::EVALUATION_PENDING,
        self::EVALUATION_ONGOING
    ];

    protected static function booted()
    {
        static::saving(function (self $academicYear) {
            if ($academicYear->active) {
                static::where('active', true)
                    ->update(['active' => false]);
            }

            if ($academicYear->status === static::EVALUATION_ONGOING) {
                static::where('status', static::EVALUATION_ONGOING)
                    ->update(['status' => static::EVALUATION_CLOSED]);
            }
        });

        static::deleting(fn (self $academicYear) => $academicYear->evaluations->each->delete());
    }

    public function scopeActive($query, $active = true)
    {
        return $query->where('active', $active);
    }

    public function scopeStatus($query, $status)
    {
        if (!in_array($status, static::EVALUATION_STATUSES)) {
            throw new InvalidArgumentException(sprintf('%s is not a valid status.', $status));
        }

        return $query->where('status', $status);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
}
