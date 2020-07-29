<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UsersTableSeeder::class,
            SeriesTableSeeder::class,
            CharactersTableSeeder::class,
            OutfitsTableSeeder::class,
            ItemsTableSeeder::class,
            TagsTableSeeder::class,
            ItemsTagTableSeeder::class,
        ]);
    }
}
