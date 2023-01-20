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
        DB::collection('items_tags')->insert([
            'item_id' => 1,
            'tag_id' => 1,
        ]);

        DB::collection('items_tags')->insert([
            'item_id' => 2,
            'tag_id' => 2,
        ]);

        DB::collection('items_tags')->insert([
            'item_id' => 3,
            'tag_id' => 3,
        ]);
    }
}
