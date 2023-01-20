<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SeriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::collection('series')->insert([
            'user_id' => 1,
            'title' => 'Love Live!',
            'image' => '300x200.png',
        ]);

        DB::collection('series')->insert([
            'user_id' => 1,
            'title' => 'Fate',
            'image' => '300x200.png',
        ]);
    }
}
