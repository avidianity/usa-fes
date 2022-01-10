<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'criteria_id',
        'description'
    ];

    public function criteria()
    {
        return $this->belongsTo(Criteria::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
