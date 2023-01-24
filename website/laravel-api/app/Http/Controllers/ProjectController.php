<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Requests\StoreUtilizationRequest;
use App\Http\Requests\UpdateUtilizationRequest;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::all()->toJson();
    }
}
