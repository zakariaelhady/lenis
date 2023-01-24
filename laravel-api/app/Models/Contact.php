<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
class Contact extends Eloquent
{
    use HasFactory;
    public $table = "contactUs";
    protected $fillable = [
        'name','email','message'
    ];
}
