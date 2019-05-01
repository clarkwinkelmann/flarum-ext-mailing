<?php

namespace Kilowhat\Mailing\Extend;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class Permissions implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Serializing::class, [$this, 'permissions']);
    }

    public function permissions(Serializing $event)
    {
        if ($event->serializer instanceof ForumSerializer) {
            $event->attributes['kilowhatMailingCanMailAll'] = $event->actor->can('kilowhat-mailing.mail-all');
            $event->attributes['kilowhatMailingCanMailIndividual'] = $event->actor->can('kilowhat-mailing.mail-individual');
        }
    }
}
