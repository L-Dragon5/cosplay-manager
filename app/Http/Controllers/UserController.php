<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Auth;
use Validator;

class UserController extends Controller
{
    private $successStatus = 200;
    private $errorStatus = 422;
    
    /**
     * Attempt to login user
     */
    public function login(Request $request) {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            return return_json_message($user->createToken('CosplayManagerToken')->accessToken, $this->successStatus);
        } else {
            return return_json_message('Incorrect login credentials provided', $this->errorStatus);
        }
    }

    /**
     * Register a user account
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'c_password' => 'required|same:password',
            'g-recaptcha-response' => 'required|recaptcha',
        ]);

        if ($validator->fails()) {
            return return_json_message($validator->errors(), $this->errorStatus);
        }

        $existing_user = User::where('email', $request->email)->first();
        if (!empty($existing_user)) {
            return return_json_message(['email' => 'E-mail is already registered'], $this->errorStatus);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);

        return return_json_message($user->createToken('CosplayManagerToken')->accessToken, $this->successStatus);
    }

    public function checkUser(Request $request) {
        $token = $request->token;

        if (empty($token) || $token === 'null') {
            return return_json_message(route('login'), $this->errorStatus);
        } else {
            $user = auth()->guard('api')->user();
            if (empty($user)) {
                return return_json_message(route('login'), $this->errorStatus);
            }
        }

        return return_json_message('User verified', $this->successStatus);
    }
}
