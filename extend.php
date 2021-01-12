<?php

namespace ClarkWinkelmann\Mailing;

use Flarum\Api\Serializer\ForumSerializer;
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
    (new Extend\ApiSerializer(ForumSerializer::class))
        ->mutate(function (ForumSerializer $serializer) {
            $actor = $serializer->getActor();

            return [
                'kilowhatMailingCanMailAll' => $actor->can('kilowhat-mailing.mail-all'),
                'kilowhatMailingCanMailIndividual' => $actor->can('kilowhat-mailing.mail-individual'),
            ];
        }),
];
