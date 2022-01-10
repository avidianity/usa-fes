<?php

namespace App\Scopes;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class RoleAnswerScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        /**
         * @var \App\Models\User
         */
        $user = auth('sanctum')->user() ?? new User();

        switch ($user->role) {
            case User::FACULTY:
                $builder->where('faculty_id', $user->id);
                break;
            case User::STUDENT:
                $builder->where('student_id', $user->id);
        }
    }
}
