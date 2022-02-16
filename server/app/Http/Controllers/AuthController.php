<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\File;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        list('email' => $email, 'password' => $password) = $request->validated();

        $builder = User::whereEmail($email)
            ->with('picture', 'section');

        if ($request->has('role')) {
            $builder->where('role', $request->input('role'));
        }

        $user = $builder->firstOrFail();

        if (!$user->active) {
            return response(['message' => 'Account is not active.'], 403);
        }

        if (!Hash::check($password, $user->password)) {
            return response(['message' => 'Password is incorrect.'], 403);
        }

        $token = $user->createToken(Str::random(10));

        return [
            'user' => $user,
            'token' => $token->plainTextToken,
        ];
    }

    public function register(RegisterRequest $request)
    {
        $user = User::create($request->validated());

        if ($request->hasFile('picture')) {
            $user->picture()->save(File::process($request->file('picture')));
        }

        return $user;
    }

    public function check(Request $request)
    {
        $user = $request->user();

        $user->load('picture');

        return $user;
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response('', 204);
    }
}
