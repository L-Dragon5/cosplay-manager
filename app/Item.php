<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = 'items';
    protected $fillable = ['user_id', 'tag_id', 'image_url', 'original_title', 'custom_title', 'seller_name', 'listing_url', 'notes', 'quantity', 'original_price', 'is_archived', 'archived_at'];
}
