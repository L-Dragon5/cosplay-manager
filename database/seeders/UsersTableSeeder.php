<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::collection('users')->insert([
            'email' => 'ace_8338@hotmail.com',
            'password' => bcrypt('password'),
        ]);
    }
}
