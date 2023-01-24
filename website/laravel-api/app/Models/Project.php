<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
class Project extends Eloquent
{
    use HasFactory;

    protected $fillable = [
        'title','source','href'
    ];
}
