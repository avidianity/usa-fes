<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'order'
    ];

    protected static function booted()
    {
        static::creating(function (self $criteria) {
            $criteria->order = static::count() + 1;
        });

        static::deleted(function () {
            $items = static::orderBy('order')->get();

            $items->map(fn (self $item, $index) => $item->update(['order' => $index + 1]));
        });
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }
}
