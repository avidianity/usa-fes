<?php

namespace App\Traits;

use App\Models\Otp;

trait HasOtps
{
    public static function bootHasOtp()
    {
        static::deleting(function (self $model) {
            $model->otps()->delete();
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function otps()
    {
        return $this->morphMany(Otp::class, 'otpable');
    }

    public function resetOtps()
    {
        $this->otps()
            ->where('used', false)
            ->get()
            ->each
            ->markAsUsed();
    }
}
