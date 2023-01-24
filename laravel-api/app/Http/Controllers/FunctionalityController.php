<?php

namespace App\Http\Controllers;

use App\Models\Functionality;
use App\Http\Requests\StoreFunctionalityRequest;
use App\Http\Requests\UpdateFunctionalityRequest;

class FunctionalityController extends Controller
{
    public function index()
    {
        return Functionality::all()->toJson();
    }

}
