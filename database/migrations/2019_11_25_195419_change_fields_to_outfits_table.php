<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeFieldsToOutfitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('outfits')) {
            Schema::table('outfits', function (Blueprint $table) {
                $table->renameColumn('bought_date', 'obtained_on');
                $table->text('creator')->nullable();
            });
        }
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('outfits', function (Blueprint $table) {
            $table->renameColumn('obtained_on', 'bought_date');
            $table->dropColumn('creator');
        });
    }
}
