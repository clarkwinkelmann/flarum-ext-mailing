<?php

namespace Kilowhat\Mailing\Controllers;

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use Flarum\User\UserRepository;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\Message;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Symfony\Component\Translation\TranslatorInterface;
use Zend\Diactoros\Response\EmptyResponse;

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

        if ($data['forAll']) {
            $this->assertCan($actor, 'kilowhat-mailing.mail-all');

            $this->users->query()->chunk(50, function ($users) use ($data) {
                foreach ($users as $user) {
                    $this->sendMail($user->email, $data['subject'], $data['text']);
                }
            });
        } else {
            $this->assertCan($actor, 'kilowhat-mailing.mail-individual');

            foreach ($data['emails'] as $email) {
                $this->sendMail($email, $data['subject'], $data['text']);
            }
        }

        return new EmptyResponse;
    }

    protected function sendMail(string $email, string $subject, string $text)
    {
        $this->mailer->send(['raw' => $text], [], function (Message $message) use ($email, $subject) {
            $message->to($email);
            $message->subject('[' . $this->settings->get('forum_title') . '] ' . ($subject !== '' ? $subject : $this->translator->trans('kilowhat-mailing.email.default_subject')));
        });
    }
}
