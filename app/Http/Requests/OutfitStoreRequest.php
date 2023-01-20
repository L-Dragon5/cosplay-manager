<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OutfitStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => 'required|string',
            'character_id' => 'required|string',
            'image' => 'nullable|string',
            'status' => 'required|integer',
            'obtained_on' => 'nullable|date_format:Y-m-d',
            'creator' => 'nullable|string',
            'storage_location' => 'nullable|string',
            'times_worn' => 'nullable|string',
            'tags' => 'nullable|array',
        ];
    }
}
