<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserForgotPasswordRequest;
use App\Http\Requests\UserRegisterRequest;
use App\Http\Requests\UserUpdatePasswordRequest;
use App\Mail\ResetPassword;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Attempt to login user.
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            return return_json_message($user->createToken('CosplayManagerToken')->accessToken, self::STATUS_SUCCESS);
        } else {
            return return_json_message('Incorrect login credentials provided', self::STATUS_BAD_REQUEST);
        }
    }

    /**
     * Register a user account.
     *
     * @param  \App\Http\Requests\UserRegisterRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function register(UserRegisterRequest $request)
    {
        $validated = $request->validated();
        $existing_user = User::where('email', $validated['email'])->first();
        if (!empty($existing_user)) {
            return return_json_message(['email' => 'E-mail is already registered'], self::STATUS_BAD_REQUEST);
        }

        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return return_json_message($user->createToken('CosplayManagerToken')->accessToken, self::STATUS_CREATED);
    }

    /**
     * Updated user account password.
     *
     * @param  \App\Http\Requests\UserUpdatePasswordRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(UserUpdatePasswordRequest $request)
    {
        $existing_user = User::where('id', Auth::user()->id)->first();
        if (empty($existing_user)) {
            return return_json_message('User doesn\'t exist', self::STATUS_BAD_REQUEST);
        } else {
            $validated = $request->validated();
            if (Hash::check($validated['old_password'], $existing_user->password)) {
                $existing_user->password = Hash::make($validated['new_password']);
                $success = $existing_user->save();

                if ($success) {
                    return return_json_message('Password updated successfully', self::STATUS_SUCCESS);
                } else {
                    return return_json_message('Something went wrong trying to update the password', self::STATUS_UNPROCESSABLE);
                }
            } else {
                return return_json_message('Old password doesn\'t match', self::STATUS_BAD_REQUEST);
            }
        }
    }

    /**
     * Email reset password to specified email address.
     *
     * @param  \App\Http\Requests\UserForgotPasswordRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function forgotPassword(UserForgotPasswordRequest $request)
    {
        $validated = $request->validated();
        $existing_user = User::where('email', $validated['email'])->first();

        // If user by that email address doesn't exist, do nothing.
        // If it exists, reset password and send email.
        if (!empty($existing_user)) {
            $new_password = Str::random(16);
            $existing_user->password = Hash::make($new_password);
            $success = $existing_user->save();

            if ($success) {
                // Send email to specified email address.
                Mail::to($existing_user->email)->send(new ResetPassword($new_password));

                return return_json_message('Email with reset password has been sent.', self::STATUS_SUCCESS);
            } else {
                return return_json_message('Something went wrong trying to reset your password.', self::STATUS_UNPROCESSABLE);
            }
        }

        return return_json_message('Email with reset password has been sent.', self::STATUS_SUCCESS);
    }
}
