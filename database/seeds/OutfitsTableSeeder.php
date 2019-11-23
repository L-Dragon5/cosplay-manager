<?php

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
        DB::table('outfits')->insert([
            'user_id' => 1,
            'character_id' => 1,
            'title' => 'White Day',
            'status' => 1,
            'bought_date' => '2019-10-31',
            'storage_location' => 'Box 1'
        ]);

        DB::table('outfits')->insert([
            'user_id' => 1,
            'character_id' => 1,
            'title' => 'Cheer',
            'status' => 2,
            'bought_date' => '2018-01-01',
            'storage_location' => 'Box 2'
        ]);

        DB::table('outfits')->insert([
            'user_id' => 1,
            'character_id' => 2,
            'title' => 'Ghost Story',
            'status' => 0
        ]);

        DB::table('outfits')->insert([
            'user_id' => 1,
            'character_id' => 3,
            'title' => 'Default',
            'status' => 0
        ]);

        DB::table('outfits')->insert([
            'user_id' => 1,
            'character_id' => 3,
            'title' => 'Swimsuit',
            'status' => 1
        ]);
    }
}
