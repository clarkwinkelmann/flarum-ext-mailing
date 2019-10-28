<?php

namespace Kilowhat\Mailing;

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),
    new Extend\Locales(__DIR__ . '/resources/locale'),
    (new Extend\Routes('api'))
        ->post('/admin-mail', 'kilowhat.mailing.create-mail', Controllers\SendAdminEmailController::class),
    new \Kilowhat\Mailing\Extend\Permissions,
];
