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
            $table->string("title");
        });

        $default_func=['RUN SCROLL IN THE MAIN THREAD',
        'LIGHTWEIGHT (UNDER 3KB)',
        'MADE FOR 2022+',
        'BRING YOUR OWN ANIMATION LIBRARY',
        'CONTROL THE SCROLL EASING DURATION',
        'USE ANY ELEMENT AS SCROLLER',
        'ENJOY HORIZONTAL + VERTICAL SUPPORT',
        'FEEL FREE TO USE “POSITION: STICKY” AGAIN',
        'TOUCH SUPPORT'];
        
        foreach ($default_func as  $value){
            $items[] = [
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
