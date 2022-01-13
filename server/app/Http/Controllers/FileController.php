<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\File  $file
     * @return \Illuminate\Http\Response
     */
    public function __invoke(File $file)
    {
        $contents = Storage::get($file->path);

        $headers = [
            'Content-Type' => $file->type,
            'Content-Length' => $file->size,
        ];

        return response($contents, 200, $headers);
    }
}
