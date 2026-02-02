<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        return Document::with('template')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:templates,id',
            'content_data' => 'required|array',
            'custom_content' => 'nullable|string',
            'status' => 'in:draft,completed,sent',
        ]);

        $document = Document::create([
            'user_id' => Auth::id(),
            'template_id' => $validated['template_id'],
            'content_data' => $validated['content_data'],
            'custom_content' => $validated['custom_content'] ?? null,
            'status' => $validated['status'] ?? 'draft',
        ]);

        return $document->load('template.fields');
    }

    public function show(Document $document)
    {
        if ($document->user_id !== Auth::id()) {
            abort(403);
        }
        return $document->load('template.fields');
    }

    public function update(Request $request, Document $document)
    {
        if ($document->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'content_data' => 'array',
            'custom_content' => 'nullable|string',
            'status' => 'in:draft,completed,sent',
        ]);

        $document->update($validated);

        return $document->load('template.fields');
    }

    public function destroy(Document $document)
    {
        if ($document->user_id !== Auth::id()) {
            abort(403);
        }
        $document->delete();
        return response()->noContent();
    }

    // Export PDF
    public function exportPDF(Document $document)
    {
        if ($document->user_id !== Auth::id()) {
            abort(403);
        }

        $content = $document->custom_content ?? '';

        // Basic HTML wrapper for PDF
        $html = "
            <html>
            <head>
                <style>
                    body { font-family: 'DejaVu Sans', sans-serif; font-size: 12pt; line-height: 1.5; }
                    p { margin-top: 0; margin-bottom: 0px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-justify { text-align: justify; }
                    @page { margin: 2cm; }
                </style>
            </head>
            <body>
                {$content}
            </body>
            </html>
        ";

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);
        return $pdf->download(($document->template->title ?? 'document') . '.pdf');
    }

    // Export Word
    public function exportWord(Document $document)
    {
        if ($document->user_id !== Auth::id()) {
            abort(403);
        }

        // Use PclZip as a fallback for ZipArchive since ext-zip might be missing on XAMPP
        if (!class_exists('ZipArchive')) {
            \PhpOffice\PhpWord\Settings::setZipClass(\PhpOffice\PhpWord\Settings::PCLZIP);
        }

        $content = $document->custom_content ?? '';

        // Wrap content in a styled container to match Editor font
        $html = '
        <html>
            <head>
                <style>
                    body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.5; }
                    p { margin-top: 0; margin-bottom: 0px; }
                    strong, b { font-weight: bold; }
                    em, i { font-style: italic; }
                    u { text-decoration: underline; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-justify { text-align: justify; }
                </style>
            </head>
            <body>' . $content . '</body>
        </html>';

        $phpWord = new \PhpOffice\PhpWord\PhpWord();
        $phpWord->setDefaultFontName('Times New Roman');
        $phpWord->setDefaultFontSize(12);

        $phpWord->setDefaultParagraphStyle([
            'lineHeight' => 1.5,
            'spaceAfter' => 0,
        ]);

        $sectionStyle = [
            'paperSize' => 'A4',
            'marginLeft' => 1134,
            'marginRight' => 1134,
            'marginTop' => 1134,
            'marginBottom' => 1134,
        ];

        $section = $phpWord->addSection($sectionStyle);

        // Basic HTML to Word conversion
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $html, false, false);

        $filename = ($document->template->title ?? 'document') . '.docx';
        $temp_file = tempnam(sys_get_temp_dir(), 'PHPWord');

        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $objWriter->save($temp_file);

        return response()->download($temp_file, $filename)->deleteFileAfterSend(true);
    }

    // Send Email (Mock Implementation for now or Basic Mail)
    // Send Email
    public function sendEmail(Request $request, Document $document)
    {
        if ($document->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'recipient_email' => 'required|email',
            'subject' => 'nullable|string',
            'cc' => 'nullable|array',
            'cc.*' => 'email',
            'bcc' => 'nullable|array',
            'bcc.*' => 'email',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240', // Max 10MB per file
        ]);

        // 1. Generate PDF Content (Same logic as exportPDF)
        $content = $document->custom_content ?? '';
        $html = "
            <html>
            <head>
                <style>
                    body { font-family: 'DejaVu Sans', sans-serif; font-size: 12pt; line-height: 1.5; }
                    p { margin-top: 0; margin-bottom: 0px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-justify { text-align: justify; }
                    @page { margin: 2cm; }
                </style>
            </head>
            <body>
                {$content}
            </body>
            </html>
        ";

        $pdfOutput = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html)->output();

        // 2. Send Email
        \Illuminate\Support\Facades\Mail::to($request->recipient_email)
            ->send(new \App\Mail\DocumentEmail(
                $document,
                $pdfOutput,
                $request->subject,
                $request->cc ?? [],
                $request->bcc ?? [],
                $request->file('attachments') ?? [],
                $content,
                ($document->template->type ?? 'document') === 'email'
            ));

        return response()->json(['message' => 'Email sent successfully']);
    }
}
