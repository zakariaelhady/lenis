<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request)
    {
        request()->validate([
            'name' => 'required',
            'email' => 'required',
            'message' => 'required',
        ]);

        Contact::create($request->all());

        return response()->json([
            'status'=>'Your message was sent Successfully'
        ]);
    }
}
