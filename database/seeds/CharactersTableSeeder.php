<?php

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
            'name' => 'Umi Sonoda'
        ]);

        DB::table('characters')->insert([
            'user_id' => 1,
            'series_id' => 1,
            'name' => 'Maki Nishikino'
        ]);

        DB::table('characters')->insert([
            'user_id' => 1,
            'series_id' => 2,
            'name' => 'Saber'
        ]);
    }
}
