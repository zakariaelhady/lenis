<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $this->down();
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->string("source");
            $table->string("href");
        });

        $default_projects=[
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
        $default_href=[
            'Wyre'=>'https://sendwyre.com',
            'Lunchbox'=>'https://lunchbox.io',
            'Scroll Animation Ideas for Image Grids'=>'https://tympanus.net/Development/ScrollAnimationsGrid/',
            'Easol'=>'https://easol.com',
            'Repeat'=>'https://getrepeat.io',
            'How to Animate SVG Shapes on Scroll'=>'https://tympanus.net/Tutorials/OnScrollPathAnimations/',
            'Dragonfly'=>'https://dragonfly.xyz',
            'Yuga Labs'=>'https://yuga.com',
            'Quentin Hocde\'s Portfolio'=>'https://quentinhocde.com/',
            'Houses Of'=>'https://housesof.world/',
            'Heights Agency'=>'https://www.heights.agency/',
            'Goodship'=>'https://goodship.io/',
        ];

        foreach ($default_projects as $key => $value){
            $items[] = [
                'title' => $key,
                'source' => $value,
                'href' => $default_href[$key]
            ];
        }
        DB::table('projects')->insert($items);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('projects');
    }
}
