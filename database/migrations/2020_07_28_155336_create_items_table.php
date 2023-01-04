<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');

            $table->text('image_url')->nullable();
            $table->text('original_title');
            $table->text('custom_title')->nullable();
            $table->text('seller_name')->nullable();
            $table->text('listing_url');
            $table->text('notes')->nullable();
            $table->unsignedTinyInteger('quantity')->default(0)->nullable();
            $table->text('original_price')->nullable();
            $table->boolean('is_archived')->default(false);

            $table->timestamp('archived_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('items');
    }
}
