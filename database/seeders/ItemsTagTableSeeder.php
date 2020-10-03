<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ItemsTagTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('items_tags')->insert([
            'item_id' => 1,
            'tag_id' => 1,
        ]);

        DB::table('items_tags')->insert([
            'item_id' => 2,
            'tag_id' => 2,
        ]);

        DB::table('items_tags')->insert([
            'item_id' => 3,
            'tag_id' => 3,
        ]);
    }
}
