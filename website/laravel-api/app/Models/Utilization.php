<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
class Utilization extends Eloquent
{
    use HasFactory;

    protected $fillable = [
        'title','studio'
    ];
}
