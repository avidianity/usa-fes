<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (User::active()->role(User::ADMIN)->count() === 0) {
            User::factory()
                ->admin()
                ->active()
                ->create([
                    'email' => 'admin@usa.edu.ph',
                    'password' => 'admin'
                ]);
        }
    }
}
