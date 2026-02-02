<?php

namespace App\Mail;

use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DocumentEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $document;
    public $pdfContent;
    public $customSubject;
    public $ccRecipients;
    public $bccRecipients;
    public $uploadedAttachments;
    public $htmlContent;
    public $isEmailMode;

    /**
     * Create a new message instance.
     */
    public function __construct(Document $document, $pdfContent, $customSubject = null, $cc = [], $bcc = [], $uploadedAttachments = [], $htmlContent = null, $isEmailMode = false)
    {
        $this->document = $document;
        $this->pdfContent = $pdfContent;
        $this->customSubject = $customSubject;
        $this->ccRecipients = $cc;
        $this->bccRecipients = $bcc;
        $this->uploadedAttachments = $uploadedAttachments;
        $this->htmlContent = $htmlContent;
        $this->isEmailMode = $isEmailMode;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new \Illuminate\Mail\Mailables\Address(
                config('mail.from.address'),
                $this->document->user->name // Show User's Name as Sender
            ),
            replyTo: [
                new \Illuminate\Mail\Mailables\Address(
                    $this->document->user->email,
                    $this->document->user->name
                )
            ],
            subject: $this->customSubject ?? ('Tài liệu: ' . ($this->document->template->title ?? 'Untitled')),
            cc: $this->ccRecipients,
            bcc: $this->bccRecipients,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.document',
            with: [
                'documentTitle' => $this->document->template->title ?? 'Tài liệu',
                'htmlContent' => $this->htmlContent,
                'isEmailMode' => $this->isEmailMode,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        if (!$this->isEmailMode && $this->pdfContent) {
            $filename = ($this->document->template->title ?? 'document') . '.pdf';
            $attachments[] = Attachment::fromData(fn() => $this->pdfContent, $filename)
                ->withMime('application/pdf');
        }

        // Add uploaded attachments
        if (!empty($this->uploadedAttachments)) {
            foreach ($this->uploadedAttachments as $file) {
                // Assuming $file is an uploaded file object or path.
                // If passed from controller as UploadedFile objects:
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $attachments[] = Attachment::fromPath($file->getRealPath())
                        ->as($file->getClientOriginalName())
                        ->withMime($file->getClientMimeType());
                }
            }
        }

        return $attachments;
    }
}
