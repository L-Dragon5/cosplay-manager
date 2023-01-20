<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::collection('items')->insert([
            'user_id' => 1,
            'image_url' => 'storage/thumbs/0.86956200 1534464471.jpg',
            'original_title' => '2604 cosplay服装 Fate/Grand Order 迷之女主角X 新品',
            'seller_name' => 'cosplay_club',
            'listing_url' => 'https://item.taobao.com/item.htm?spm=a230r.1.14.77.3b517bf8PZAWca&id=547491815585&ns=1&abbucket=3#detail',
            'original_price' => '658.00',
        ]);

        DB::collection('items')->insert([
            'user_id' => 1,
            'image_url' => 'storage/thumbs/0.11164700 1534464473.jpg',
            'original_title' => '美萌工坊薇尔莉特cosplay京紫罗兰永恒花园女连衣裙动漫服预售',
            'seller_name' => 'e感应少年',
            'listing_url' => 'https://item.taobao.com/item.htm?spm=a230r.1.14.27.7f7a1b1e2wCwdE&id=555852999918&ns=1&abbucket=1#detail',
            'original_price' => '638.00 - 898.00',
        ]);

        DB::collection('items')->insert([
            'user_id' => 1,
            'image_url' => 'storage/thumbs/0.86095500 1534464657.jpg',
            'original_title' => '现货【ICOS】罪恶王冠 ?G祈 红色战斗服 金鱼装高档cos服装',
            'seller_name' => '卡茜末哆',
            'listing_url' => 'https://item.taobao.com/item.htm?spm=a230r.1.14.119.7f7a1b1e2wCwdE&id=17331224205&ns=1&abbucket=1#detail',
            'original_price' => '820.00',
        ]);

        DB::collection('items')->insert([
            'user_id' => 1,
            'image_url' => 'storage/thumbs/0.85982900 1534464659.jpg',
            'original_title' => '现货ICOS Egoist 歌姬 chelly 精选辑 白色封面礼服 cos服 ?G祈',
            'seller_name' => '卡茜末哆',
            'listing_url' => 'https://item.taobao.com/item.htm?spm=a230r.1.14.308.7f7a1b1e2wCwdE&id=564933606915&ns=1&abbucket=1#detail',
            'original_price' => '478.00 - 488.00',
        ]);

        DB::collection('items')->insert([
            'user_id' => 1,
            'image_url' => 'storage/thumbs/0.95907400 1534464661.jpg',
            'original_title' => '【兔爸道具】fate/FGO贞德黑贞德初始满破盔甲旗矛佩剑cos道具',
            'seller_name' => '孙奇灿',
            'listing_url' => 'https://item.taobao.com/item.htm?spm=a230r.1.14.217.7f7a1b1e2wCwdE&id=551902496387&ns=1&abbucket=1#detail',
            'original_price' => '79.00 - 800.00',
        ]);

        DB::collection('items')->insert([
            'user_id' => 1,
            'image_url' => 'http://img.alicdn.com/imgextra/i1/3681083810/O1CN01u8jMza1e11aO2UKGQ_!!3681083810-0-pixelsss.jpg_430x430q90.jpg',
            'original_title' => '【秀琴家 蝴蝶忍cos假发】鬼灭之刃cosplay假毛 渐变蓝紫 发饰 ?',
            'seller_name' => 'hsiu/秀琴家',
            'listing_url' => 'https://detail.tmall.com/item.htm?spm=a230r.1.14.52.5bf97d7aUdxJDS&id=602478668895&ns=1&abbucket=20&sku_properties=134942334:28383',
            'original_price' => '-1.00',
        ]);
    }
}
