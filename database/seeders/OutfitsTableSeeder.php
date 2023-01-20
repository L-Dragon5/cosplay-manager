<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class OutfitsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::collection('outfits')->insert([
            'user_id' => 1,
            'character_id' => 1,
            'title' => 'White Day',
            'images' => '||300x400.png',
            'status' => 1,
            'obtained_on' => '2019-10-31',
            'storage_location' => 'Box 1',
        ]);

        DB::collection('outfits')->insert([
            'user_id' => 1,
            'character_id' => 1,
            'title' => 'Cheer',
            'images' => '||300x400.png',
            'status' => 2,
            'obtained_on' => '2018-01-01',
            'storage_location' => 'Box 2',
        ]);

        DB::collection('outfits')->insert([
            'user_id' => 1,
            'character_id' => 2,
            'title' => 'Ghost Story',
            'images' => '||300x400.png',
            'status' => 0,
        ]);

        DB::collection('outfits')->insert([
            'user_id' => 1,
            'character_id' => 3,
            'title' => 'Default',
            'images' => '||300x400.png',
            'status' => 0,
        ]);

        DB::collection('outfits')->insert([
            'user_id' => 1,
            'character_id' => 3,
            'title' => 'Swimsuit',
            'images' => '||300x400.png',
            'status' => 1,
        ]);
    }
}
