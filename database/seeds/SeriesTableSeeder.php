<?php

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
        DB::table('series')->insert([
            'user_id' => 1,
            'title' => 'Love Live!'
        ]);

        DB::table('series')->insert([
            'user_id' => 1,
            'title' => 'Fate'
        ]);
    }
}
