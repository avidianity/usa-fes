<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerifyOtpRequest;
use App\Models\Otp;

class OtpController extends Controller
{
    public function verify(VerifyOtpRequest $request)
    {
        $data = $request->validated();

        /**
         * @var \App\Models\Otp|null
         */
        $otp = Otp::verification($data['verification'])
            ->notUsed()
            ->first();

        if (!$otp) {
            return response(['message' => 'Verification is invalid.'], 400);
        }

        $code = (string)$data['otp'];

        if ($otp->isExpired()) {
            $otp->markAsUsed();
            return response(['message' => 'Otp is expired.'], 403);
        }

        if ($otp->code !== $code) {
            return response(['message' => 'Otp is invalid.'], 400);
        }

        return [
            'uuid' => $otp->uuid,
        ];
    }
}
