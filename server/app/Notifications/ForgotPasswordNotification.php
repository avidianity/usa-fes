<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ForgotPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @var \App\Models\Otp
     */
    protected $otp;

    /**
     * @var string
     */
    protected $name;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Otp $otp
     * @param  string $name
     * @return void
     */
    public function __construct($otp, $name)
    {
        $this->otp = $otp;
        $this->name = $name;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $expiration = config('otp.expiration');

        return (new MailMessage)
            ->subject('Forgot Password Request')
            ->line(sprintf('Hi %s!', $this->name))
            ->line(sprintf('Your OTP for password reset is: %s', "{$this->otp->code}"))
            ->line(sprintf('Please use it within %s minutes.', "$expiration"))
            ->line('Thank you!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'notifiable' => $notifiable,
            'otp' => $this->otp
        ];
    }
}
