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
            'title' => 'White Day'
        ]);

        DB::table('outfits')->insert([
            'user_id' => 1,
            'character_id' => 1,
            'title' => 'Cheer'
        ]);

        DB::table('outfits')->insert([
            'user_id' => 1,
            'character_id' => 2,
            'title' => 'Ghost Story'
        ]);

        DB::table('outfits')->insert([
            'user_id' => 1,
            'character_id' => 3,
            'title' => 'Default'
        ]);

        DB::table('outfits')->insert([
            'user_id' => 1,
            'character_id' => 3,
            'title' => 'Swimsuit'
        ]);
    }
}
