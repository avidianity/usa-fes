<?php

namespace App\Models;

use App\Casts\Password;
use App\Scopes\RoleUserScope;
use App\Traits\HasFile;
use App\Traits\HasOtps;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use InvalidArgumentException;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use HasFile {
        file as picture;
    }
    use HasOtps;

    const STUDENT = 'Student';
    const ADMIN = 'Admin';
    const FACULTY = 'Faculty';

    /**
     * @var string[]
     */
    const ROLES = [
        self::STUDENT,
        self::ADMIN,
        self::FACULTY
    ];

    protected $fillable = [
        'school_id',
        'first_name',
        'last_name',
        'email',
        'password',
        'active',
        'role',
        'section_id'
    ];

    protected $hidden = ['password'];

    protected $appends = ['name'];

    protected $casts = [
        'active' => 'boolean',
        'password' => Password::class,
        'section_id' => 'integer'
    ];

    protected static function booted()
    {
        static::addGlobalScope(new RoleUserScope());

        static::deleted(function (self $user) {
            optional($user->picture)->delete();
        });
    }

    public function scopeActive($query, $active = true)
    {
        return $query->where('active', $active);
    }

    public function scopeRole($query, $role)
    {
        if (!in_array($role, static::ROLES)) {
            throw new InvalidArgumentException(sprintf('%s is not a valid role.', $role));
        }

        return $query->where('role', $role);
    }

    public function getNameAttribute()
    {
        return sprintf('%s %s', $this->attributes['first_name'], $this->attributes['last_name']);
    }
}
