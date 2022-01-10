<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

if (!function_exists('frontend')) {
    /**
     * Create a frontend url
     *
     * @param string $url
     * @return string
     */
    function frontend($url)
    {
        return config('app.frontend_url') . $url;
    }
}

if (!function_exists('isBase64')) {
    /**
     * Check if a given string is valid base64 payload
     *
     * @param string $string
     * @return boolean
     */
    function isBase64($string)
    {
        if (!preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $string)) return false;

        $decoded = base64_decode($string, true);
        if (false === $decoded) return false;

        if (base64_encode($decoded) !== $string) return false;

        return true;
    }
}

if (!function_exists('newModelNotFound')) {
    /**
     * Manually create a ModelNotFoundException
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    function newModelNotFound(Model $model)
    {
        return (new ModelNotFoundException())->setModel(
            get_class($model),
            $model->id
        );
    }
}
