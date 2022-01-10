<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        /**
         * Create fake data for the model
         *
         * @return array
         */
        Factory::macro('data', function () {
            return $this->make()->toArray();
        });

        /**
         * Transform eloquent collection to id-only
         *
         * @return static
         */
        Collection::macro('toIDs', function () {
            return $this->map(function ($model) {
                return ['id' => is_array($model) ? $model['id'] : $model->id];
            });
        });
    }
}
