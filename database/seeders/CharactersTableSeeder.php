<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CharactersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('characters')->insert([
            'user_id' => 1,
            'series_id' => 1,
            'name' => 'Umi Sonoda',
            'image' => '200x400.png',
        ]);

        DB::table('characters')->insert([
            'user_id' => 1,
            'series_id' => 1,
            'name' => 'Maki Nishikino',
            'image' => '200x400.png',
        ]);

        DB::table('characters')->insert([
            'user_id' => 1,
            'series_id' => 2,
            'name' => 'Saber',
            'image' => '200x400.png',
        ]);
    }
}
