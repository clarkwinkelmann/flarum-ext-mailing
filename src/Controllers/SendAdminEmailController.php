<?php

namespace ClarkWinkelmann\Mailing\Controllers;

use Flarum\Foundation\ValidationException;
use Flarum\Group\Group;
use Flarum\Http\RequestUtil;
use Flarum\User\UserRepository;
use Illuminate\Contracts\Queue\Queue;
use Illuminate\Contracts\Translation\Translator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use ClarkWinkelmann\Mailing\Jobs\SendMail;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class SendAdminEmailController implements RequestHandlerInterface
{
    public function __construct(
        protected UserRepository $users,
        protected Queue          $queue)
    {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);

        $data = (array)Arr::get($request->getParsedBody(), 'data');
        $recipients = collect((array)Arr::get($data, 'recipients'));

        $userIds = $recipients->filter(function ($model) {
            return Arr::get($model, 'type') === 'users';
        })->map(function ($model) {
            return Arr::get($model, 'id');
        })->toArray();

        $emails = $recipients->filter(function ($model) {
            return Arr::get($model, 'type') === 'clarkwinkelmann-mailing-emails';
        })->map(function ($model) {
            return Arr::get($model, 'attributes.email');
        })->toArray();

        $groupIds = $recipients->filter(function ($model) {
            return Arr::get($model, 'type') === 'groups';
        })->map(function ($model) {
            return Arr::get($model, 'id');
        })->toArray();

        if (count($groupIds)) {
            $actor->assertCan('kilowhat-mailing.mail-all');
        } else {
            $actor->assertCan('kilowhat-mailing.mail-individual');
        }

        $userQuery = $this->users->query();

        // If the MEMBER_ID group is passed, we select every user of the database
        // Otherwise we restrict by user and group IDs as given
        if (!in_array(Group::MEMBER_ID, $groupIds)) {
            $userQuery->whereIn('id', $userIds)
                ->orWhereHas('groups', function (Builder $query) use ($groupIds) {
                    $query->whereIn('id', $groupIds);
                });
        }

        $subject = (string)Arr::get($data, 'subject');
        $text = (string)Arr::get($data, 'text');
        $html = (bool)Arr::get($data, 'asHtml');

        $recipientCount = 0;

        $userQuery->chunk(50, function ($users) use ($subject, $text, $html, &$recipientCount) {
            foreach ($users as $user) {
                $this->queue->push(new SendMail($user->email, $subject, $text, $html));

                $recipientCount++;
            }
        });

        foreach ($emails as $email) {
            $this->queue->push(new SendMail($email, $subject, $text, $html));

            $recipientCount++;
        }

        if ($recipientCount === 0) {
            /**
             * @var $translator Translator
             */
            $translator = resolve(Translator::class);

            throw new ValidationException([
                'recipients' => [
                    $translator->get('kilowhat-mailing.api.no_recipients'),
                ],
            ]);
        }

        return new JsonResponse([
            'recipientsCount' => $recipientCount,
        ]);
    }
}
