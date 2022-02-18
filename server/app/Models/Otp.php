<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Otp extends Model
{
    use HasFactory;

    protected $casts = [
        'used' => 'boolean'
    ];

    protected static function booted()
    {
        static::creating(function (self $otp) {
            $otp->uuid = Str::uuid()->toString();
            $otp->verification = Str::uuid()->toString();
            $otp->code = mt_rand(111111, 999999);
        });
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @param  string $uuid
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUuid($query, $uuid)
    {
        return $query->where('uuid', $uuid);
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @param  string $verification
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeVerification($query, $verification)
    {
        return $query->where('verification', $verification);
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @param  string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeType($query, $type)
    {
        return $query->where('otpable_type', $type);
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNotUsed($query)
    {
        return $query->where('used', false);
    }

    public function markAsUsed()
    {
        $this->used = true;
        $this->save();

        return $this;
    }

    public function otpable()
    {
        return $this->morphTo();
    }

    public function isExpired()
    {
        return !$this->created_at->addMinutes(config('otp.expiration'))->isFuture();
    }
}
