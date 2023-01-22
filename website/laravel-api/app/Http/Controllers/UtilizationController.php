<?php

namespace App\Http\Controllers;

use App\Models\Utilization;
use App\Http\Requests\StoreUtilizationRequest;
use App\Http\Requests\UpdateUtilizationRequest;

class UtilizationController extends Controller
{
    public function index()
    {
        return Utilization::all();
    }
}
