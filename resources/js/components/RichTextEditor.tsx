import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Hash, FileJson, Undo, Redo
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    variables?: { key: string; label: string }[];
    height?: string;
    isFullScreen?: boolean;
    type?: 'document' | 'email';
}

const DOCUMENT_SNIPPETS = [
    {
        label: 'Quốc hiệu & Tiêu ngữ',
        content: '<p style="text-align: center;"><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>Độc lập - Tự do - Hạnh phúc</p>'
    },
    {
        label: 'Địa danh, ngày tháng',
        content: '<p style="text-align: right;"><em>......, ngày ... tháng ... năm ...</em></p>'
    },
    {
        label: 'Kính gửi',
        content: '<p><strong>Kính gửi:</strong>.......................................................................................</p>'
    },
    {
        label: 'Căn cứ (Quyết định)',
        content: '<p><em>- Căn cứ Bộ luật Lao động nước CHXHCN Việt Nam;<br>- Căn cứ nhu cầu và khả năng thực tế của Công ty...</em></p>'
    }
];

const EMAIL_SNIPPETS = [
    {
        label: 'Chào hỏi trang trọng',
        content: '<p>Kính gửi Ông/Bà <strong>{{tên_người_nhận}}</strong>,</p>'
    },
    {
        label: 'Chào hỏi thân mật',
        content: '<p>Xin chào <strong>{{tên_người_nhận}}</strong>,</p>'
    },
    {
        label: 'Kết thư trang trọng',
        content: '<p>Trân trọng,<br><strong>[Tên của bạn]</strong></p>'
    },
    {
        label: 'Thông báo đính kèm',
        content: '<p>Tôi xin gửi kèm theo đây tài liệu liên quan. Vui lòng xem tệp đính kèm.</p>'
    },
    {
        label: 'Yêu cầu phản hồi',
        content: '<p>Rất mong nhận được phản hồi sớm từ phía Ông/Bà.</p>'
    }
];

export default function RichTextEditor({ value, onChange, variables = [], height = '400px', isFullScreen = false, type = 'document' }: RichTextEditorProps) {

    const editorRef = useRef<HTMLDivElement>(null);
    const savedRange = useRef<Range | null>(null);
    const [fontSize, setFontSize] = useState('3');
    const [fontName, setFontName] = useState('Arial');
    const [activeDropdown, setActiveDropdown] = useState<'variables' | 'snippets' | null>(null);

    // Sync value to innerHTML only when they differ (avoids cursor reset)
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
            savedRange.current = sel.getRangeAt(0);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        if (savedRange.current) {
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(savedRange.current);
            }
        }

        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            saveSelection();
        }
    };

    const insertHTML = (html: string) => {
        if (editorRef.current) {
            if (savedRange.current) {
                const sel = window.getSelection();
                if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(savedRange.current);
                }
            } else {
                editorRef.current.focus();
            }

            document.execCommand('insertHTML', false, html);
            onChange(editorRef.current.innerHTML);
            saveSelection();
            setActiveDropdown(null);
        }
    };

    const toggleDropdown = (name: 'variables' | 'snippets') => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            saveSelection();
            setActiveDropdown(name);
        }
    };

    return (
        <div className={`flex flex-col bg-white ${isFullScreen ? 'h-full' : 'border border-gray-300 rounded-lg'}`}>
            {/* Toolbar */}
            <div className={`flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 ${isFullScreen ? '' : 'rounded-t-lg'} justify-between`} onMouseDown={(e) => e.preventDefault()}>

                <div className="flex flex-wrap items-center gap-1">
                    {/* History */}
                    <div className="flex border-r border-gray-300 pr-2 space-x-0.5">
                        <button type="button" onClick={() => execCommand('undo')} className="p-1.5 hover:bg-gray-200 rounded" title="Hoàn tác (Ctrl+Z)">
                            <Undo className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('redo')} className="p-1.5 hover:bg-gray-200 rounded" title="Làm lại (Ctrl+Y)">
                            <Redo className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Font Style */}
                    <div className="flex border-r border-gray-300 pr-2 space-x-0.5">
                        <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-gray-200 rounded" title="In đậm (Ctrl+B)">
                            <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-gray-200 rounded" title="In nghiêng (Ctrl+I)">
                            <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-gray-200 rounded" title="Gạch chân (Ctrl+U)">
                            <Underline className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Alignment */}
                    <div className="flex border-r border-gray-300 pr-2 space-x-0.5 ml-1">
                        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-gray-200 rounded" title="Căn trái">
                            <AlignLeft className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-gray-200 rounded" title="Căn giữa">
                            <AlignCenter className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('justifyRight')} className="p-1.5 hover:bg-gray-200 rounded" title="Căn phải">
                            <AlignRight className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('justifyFull')} className="p-1.5 hover:bg-gray-200 rounded" title="Căn đều">
                            <AlignJustify className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Font Options */}
                    <div className="flex items-center space-x-1 ml-1 border-r border-gray-300 pr-2">
                        <select
                            onChange={(e) => { setFontName(e.target.value); execCommand('fontName', e.target.value); }}
                            value={fontName}
                            className="h-7 text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                        </select>
                        <select
                            onChange={(e) => { setFontSize(e.target.value); execCommand('fontSize', e.target.value); }}
                            value={fontSize}
                            className="h-7 text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 w-20"
                        >
                            <option value="1">Nhỏ</option>
                            <option value="2">Bình thường</option>
                            <option value="3">Vừa</option>
                            <option value="4">Lớn</option>
                            <option value="5">Rất lớn</option>
                            <option value="6">Tiêu đề</option>
                        </select>
                    </div>

                    {/* Block Format */}
                    <div className="flex items-center space-x-0.5 ml-1 border-r border-gray-300 pr-2 text-gray-700">
                        <button type="button" onClick={() => execCommand('formatBlock', 'H1')} className="p-1.5 hover:bg-gray-200 rounded font-bold text-xs" title="Tiêu đề 1">H1</button>
                        <button type="button" onClick={() => execCommand('formatBlock', 'H2')} className="p-1.5 hover:bg-gray-200 rounded font-bold text-xs" title="Tiêu đề 2">H2</button>
                        <button type="button" onClick={() => execCommand('formatBlock', 'P')} className="p-1.5 hover:bg-gray-200 rounded font-bold text-xs" title="Đoạn văn">P</button>
                    </div>

                    {/* Variable Inserter */}
                    {variables.length > 0 && (
                        <div className="flex items-center ml-1 border-r border-gray-300 pr-2">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown('variables')}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border ${activeDropdown === 'variables' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                                >
                                    <Hash className="w-3 h-3" />
                                    <span>Chèn biến</span>
                                </button>
                                {activeDropdown === 'variables' && (
                                    <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                                        <div className="py-1">
                                            {variables.map((v) => (
                                                <button
                                                    key={v.key}
                                                    type="button"
                                                    onClick={() => insertHTML(`<span class="template-variable" data-variable="${v.key}" style="background-color: #eff6ff; color: #1d4ed8; padding: 0 4px; border-radius: 4px; border: 1px dashed #93c5fd;">${v.label}</span>&nbsp;`)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <span className="font-medium text-blue-600">[{v.label}]</span>
                                                    <span className="text-gray-400 text-xs ml-1">{'{{'}{v.key}{'}}'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Snippet Inserter */}
                    <div className="flex items-center ml-1">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => toggleDropdown('snippets')}
                                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border ${activeDropdown === 'snippets' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
                            >
                                <FileJson className="w-3 h-3" />
                                <span>Mẫu câu</span>
                            </button>
                            {activeDropdown === 'snippets' && (
                                <div className="absolute left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    <div className="py-1">
                                        {(type === 'email' ? EMAIL_SNIPPETS : DOCUMENT_SNIPPETS).map((s, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => insertHTML(s.content)}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b last:border-0"
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Editable Area Container */}
            <div className={`flex-1 ${isFullScreen ? 'overflow-auto flex justify-center p-8 bg-gray-100' : 'flex flex-col'}`}>
                <div
                    ref={editorRef}
                    className={`${isFullScreen
                        ? 'bg-white shadow-lg min-h-[297mm] w-[210mm] p-[20mm]'
                        : 'flex-1 p-4 prose max-w-none focus:outline-none overflow-y-auto rounded-b-lg'
                        } outline-none`}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => {
                        const html = e.currentTarget.innerHTML;
                        if (html !== value) {
                            onChange(html);
                        }
                    }}
                    onBlur={(e) => {
                        const html = e.currentTarget.innerHTML;
                        if (html !== value) {
                            onChange(html);
                        }
                        saveSelection();
                    }}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                    style={{
                        height: isFullScreen ? 'auto' : height,
                        fontFamily: '"Times New Roman", Times, serif',
                        lineHeight: '1.5'
                    }}
                />
            </div>
        </div>
    );
}
