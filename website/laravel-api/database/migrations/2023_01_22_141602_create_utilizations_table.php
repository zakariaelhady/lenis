<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUtilizationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->down();
        Schema::create('utilizations', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->string("studio");
        });

        $default_use=[
            'Wyre'=>'Studio Freight',
            'Lunchbox'=>'Studio Freight',
            'Scroll Animation Ideas for Image Grids'=>'Codrops',
            'Easol'=>'Studio Freight',
            'Repeat'=>'Studio Freight',
            'How to Animate SVG Shapes on Scroll'=>'Codrops',
            'Dragonfly'=>'Studio Freight',
            'Yuga Labs'=>'Antinomy Studio',
            'Quentin Hocde\'s Portfolio'=>'Quentin Hocde',
            'Houses Of'=>'Felix P. & Shelby Kay',
            'Heights Agency'=>'Francesco Michelini',
            'Goodship'=>'Studio Freight',
        ];

        foreach ($default_use as $key => $value){
            $items[] = [
                'title' => $key,
                'studio' => $value
            ];
        }
        DB::table('utilizations')->insert($items);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('utilizations');
    }
}
