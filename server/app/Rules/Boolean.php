<?php

namespace App\Rules;

use Illuminate\Validation\Rules\In;

class Boolean extends In
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct([true, false, 'true', 'false']);
    }
}
