<?php

namespace Kilowhat\Mailing\Controllers;

use Flarum\Foundation\ValidationException;
use Flarum\Group\Group;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use Flarum\User\UserRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\Message;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Symfony\Component\Translation\TranslatorInterface;
use Zend\Diactoros\Response\JsonResponse;

class SendAdminEmailController implements RequestHandlerInterface
{
    use AssertPermissionTrait;

    protected $settings;
    protected $mailer;
    protected $translator;
    protected $users;

    public function __construct(SettingsRepositoryInterface $settings, Mailer $mailer, TranslatorInterface $translator, UserRepository $users)
    {
        $this->settings = $settings;
        $this->mailer = $mailer;
        $this->translator = $translator;
        $this->users = $users;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = $request->getAttribute('actor');

        $data = Arr::get($request->getParsedBody(), 'data', []);
        $recipients = collect(Arr::get($data, 'recipients', []));

        $userIds = $recipients->filter(function ($model) {
            return Arr::get($model, 'type') === 'users';
        })->map(function ($model) {
            return Arr::get($model, 'id');
        })->toArray();

        $emails = $recipients->filter(function ($model) {
            return Arr::get($model, 'type') === 'kilowhat-mailing-emails';
        })->map(function ($model) {
            return Arr::get($model, 'attributes.email');
        })->toArray();

        $groupIds = $recipients->filter(function ($model) {
            return Arr::get($model, 'type') === 'groups';
        })->map(function ($model) {
            return Arr::get($model, 'id');
        })->toArray();

        if (count($groupIds)) {
            $this->assertCan($actor, 'kilowhat-mailing.mail-all');
        } else {
            $this->assertCan($actor, 'kilowhat-mailing.mail-individual');
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

        $recipientCount = 0;

        $userQuery->chunk(50, function ($users) use ($data, &$recipientCount) {
            foreach ($users as $user) {
                $this->sendMail($user->email, $data['subject'], $data['text']);

                $recipientCount++;
            }
        });

        foreach ($emails as $email) {
            $this->sendMail($email, $data['subject'], $data['text']);

            $recipientCount++;
        }

        if ($recipientCount === 0) {
            /**
             * @var $translator TranslatorInterface
             */
            $translator = app(TranslatorInterface::class);

            throw new ValidationException([
                'recipients' => [
                    $translator->trans('kilowhat-mailing.api.no_recipients'),
                ],
            ]);
        }

        return new JsonResponse([
            'recipientsCount' => $recipientCount,
        ]);
    }

    protected function sendMail(string $email, string $subject, string $text)
    {
        $this->mailer->send(['raw' => $text], [], function (Message $message) use ($email, $subject) {
            $message->to($email);
            $message->subject('[' . $this->settings->get('forum_title') . '] ' . ($subject !== '' ? $subject : $this->translator->trans('kilowhat-mailing.email.default_subject')));
        });
    }
}
