<?php

use Illuminate\Database\Seeder;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tags')->insert([
            'user_id' => 1,
            'parent_id' => 0,
            'title' => 'Test Tag 1',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'parent_id' => 0,
            'title' => 'Test Tag 2',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'parent_id' => 1,
            'title' => 'Test Tag 1 Child 1',
        ]);
    }
}
