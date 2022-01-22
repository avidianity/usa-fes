<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserSeeder::class);
        $this->call(SectionSeeder::class);
        $this->call(SubjectSeeder::class);
        $this->call(AcademicYearSeeder::class);
        $this->call(CriteriaSeeder::class);
    }
}
