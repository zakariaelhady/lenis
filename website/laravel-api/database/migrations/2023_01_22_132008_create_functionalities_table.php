<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFunctionalitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->down();

        Schema::create('functionalities', function (Blueprint $table) {
            $table->id();
            $table->string('number');
            $table->string("title");
        });

        $default_func=['1'=>'RUN SCROLL IN THE MAIN THREAD',
        '2'=>'LIGHTWEIGHT (UNDER 3KB)',
        '3'=>'MADE FOR 2022+',
        '4'=>'BRING YOUR OWN ANIMATION LIBRARY',
        '5'=>'CONTROL THE SCROLL EASING DURATION',
        '6'=>'USE ANY ELEMENT AS SCROLLER',
        '7'=>'ENJOY HORIZONTAL + VERTICAL SUPPORT',
        '8'=>'FEEL FREE TO USE “POSITION: STICKY” AGAIN',
        '9'=>'TOUCH SUPPORT'];
        
        foreach ($default_func as $key => $value){
            $items[] = [
                'number' => $key,
                'title' => $value
            ];
        }
        DB::table('functionalities')->insert($items);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('functionalities');
    }
}
