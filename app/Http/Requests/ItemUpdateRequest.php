<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemUpdateRequest extends FormRequest
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
            'custom_title' => 'nullable|string',
            'quantity' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'tags' => 'nullable',
            'tags.*' => 'nullable|string',
        ];
    }
}
