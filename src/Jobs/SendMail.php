<?php

namespace Kilowhat\Mailing\Jobs;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\Message;
use Symfony\Component\Translation\TranslatorInterface;

class SendMail implements ShouldQueue
{
    use Queueable;

    protected $email;
    protected $subject;
    protected $text;

    public function __construct(string $email, string $subject, string $text)
    {
        $this->email = $email;
        $this->subject = $subject;
        $this->text = $text;
    }

    public function handle(SettingsRepositoryInterface $settings, Mailer $mailer, TranslatorInterface $translator)
    {
        $mailer->send(['raw' => $this->text], [], function (Message $message) use ($settings, $translator) {
            $message->to($this->email);
            $message->subject('[' . $settings->get('forum_title') . '] ' . ($this->subject !== '' ? $this->subject : $translator->trans('kilowhat-mailing.email.default_subject')));
        });
    }
}
