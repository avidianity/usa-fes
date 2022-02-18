<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompleteForgotPasswordRequest;
use App\Http\Requests\SendForgotPasswordRequest;
use App\Models\Otp;
use App\Models\User;
use App\Notifications\ForgotPasswordNotification;
use Illuminate\Support\Facades\DB;

class ForgotPasswordController extends Controller
{
    public function send(SendForgotPasswordRequest $request)
    {
        $email = $request->input('email');

        if (!config('mail.enabled')) {
            return response(['message' => 'Mailing is not currently available.'], 400);
        }

        $user = User::where('email', $email)->firstOrFail();

        $name = sprintf('%s %s', $user->first_name, $user->last_name);

        $user->resetOtps();

        /**
         * @var \App\Models\Otp
         */
        $otp = $user->otps()->create();

        $user->notify(new ForgotPasswordNotification($otp, $name));

        return [
            'verification' => $otp->verification
        ];
    }

    public function complete(CompleteForgotPasswordRequest $request)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data) {
            /**
             * @var \App\Models\Otp|null
             */
            $otp = Otp::verification($data['verification'])
                ->uuid($data['uuid'])
                ->type(User::class)
                ->notUsed()
                ->with('otpable')
                ->first();

            if (!$otp) {
                return response(['message' => 'Verification is invalid.'], 400);
            }

            if ($otp->isExpired()) {
                $otp->markAsUsed();
                return response(['message' => 'Otp is expired.'], 403);
            }

            /**
             * @var \App\Models\User
             */
            $user = $otp->otpable;

            $user->update(['password' => $data['password']]);

            $otp->markAsUsed();

            return response('', 204);
        });
    }
}
