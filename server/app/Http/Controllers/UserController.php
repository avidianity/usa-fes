<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetUsersRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\File;
use App\Models\User;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(sprintf('role:%s', User::ADMIN))->only('store', 'update', 'destroy');
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \App\Http\Requests\GetUsersRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function index(GetUsersRequest $request)
    {
        $builder = User::with('picture');

        if ($request->has('role')) {
            $role = $request->input('role');

            $builder->where('role', $role);

            if ($role === User::STUDENT) {
                $builder->with('section');
            }
        }

        return $builder->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreUserRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->all());

        if ($request->hasFile('picture')) {
            $user->picture()->save(File::process($request->file('picture')));
        }

        return $user;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $user->load('picture');
        return $user;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateUserRequest  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->all());

        if ($request->hasFile('picture')) {
            optional($user->picture)->delete();
            $user->picture()->save(File::process($request->file('picture')));
        }

        return $user;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response('', 204);
    }
}
