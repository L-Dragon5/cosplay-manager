# Cosplay Manager
Management web application useful for planning future cosplays and archiving past cosplays.

Built on Laravel REST API backend with a ReactJS frontend.
Styled using Google's Material Design via MaterializeCSS.

## Requirements
* MySQL/MariaDB Server
* PHP >= 7.2.0
* PHP Extensions: BCMath, Ctype, JSON, Mbstring, OpenSSL, PDO, XML
* Composer

## Common Commands on Installation
- php artisan passport:install
- php artisan storage:link

## To-Do
- Outfit
  - ~~Add~~ / Edit / ~~Delete~~
  - Fields:
    - User ID
    - Character ID
    - Title
    - Images
    - Status: Future Cosplay, Owned & Unworn, Worn
    - Bought Date
    - Storage Location
    - Times Worn
- All Cosplays View (w/ search and filter)
- ~~Series~~
- ~~Character~~
- ~~Upload images~~