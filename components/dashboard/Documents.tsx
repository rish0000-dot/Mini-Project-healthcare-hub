
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FileText, Upload, Plus, Calendar, Image as ImageIcon, 
    Trash2, Send, Loader2, Download,
    AlertCircle, X, MessageSquare
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const Documents = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    
    const [textContent, setTextContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDocuments = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error: docsError } = await supabase
                .from('documents')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (docsError) throw docsError;
            setDocuments(data || []);
            
            const uniqueDates = [...new Set((data || []).map((doc: any) => doc.upload_date))].sort().reverse();
            if (uniqueDates.length > 0 && !selectedDate) {
                setSelectedDate(uniqueDates[0] as string);
            }
        } catch (err) {
            console.error("Error fetching documents:", err);
            setError("Failed to load documents.");
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile && !textContent.trim()) {
            setError("Please provide a file or a note.");
            return;
        }

        if (selectedFile) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError("Only PDF and Images (JPEG, PNG, WEBP) are allowed.");
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB.");
                return;
            }
        }

        try {
            setUploading(true);
            setError("");
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            let fileUrl = "";
            if (selectedFile) {
                const filePath = `${user.id}/${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                const { error: uploadError } = await supabase.storage
                    .from('user_documents')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('user_documents')
                    .getPublicUrl(filePath);
                fileUrl = publicUrl;
            }

            const { error: dbError } = await supabase
                .from('documents')
                .insert({
                    user_id: user.id,
                    title: selectedFile ? selectedFile.name : "Health Note",
                    file_url: fileUrl,
                    text_content: textContent.trim() || null,
                    upload_date: new Date().toISOString().split('T')[0]
                });

            if (dbError) throw dbError;

            setTextContent("");
            setSelectedFile(null);
            setShowUploadModal(false);
            fetchDocuments();
        } catch (err: any) {
            setError(err.message || "Failed to upload document.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!window.confirm("Delete this document?")) return;

        try {
            if (fileUrl) {
                const pathParts = fileUrl.split('/user_documents/');
                if (pathParts.length > 1) {
                    await supabase.storage.from('user_documents').remove([pathParts[1]]);
                }
            }

            const { error } = await supabase.from('documents').delete().eq('id', id);
            if (error) throw error;
            fetchDocuments();
        } catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete record.");
        }
    };

    const dates = [...new Set(documents.map(doc => doc.upload_date))].sort().reverse();
    const filteredDocs = documents.filter(doc => doc.upload_date === (selectedDate || dates[0]));

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FileText className="text-medical-blue" size={32} />
                        Document Vault
                    </h1>
                    <p className="text-slate-500 font-medium">Secure storage for your medical records and notes.</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-[1.5rem] bg-slate-900 text-white font-black text-sm uppercase tracking-wider hover:bg-medical-blue transition-all shadow-xl"
                >
                    <Plus size={20} /> Upload New
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[500px]">
                <div className="lg:col-span-3 space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Timeline</h3>
                    <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2">
                        {dates.length === 0 ? (
                            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 text-center">
                                <p className="text-[10px] font-bold text-slate-400">No records yet</p>
                            </div>
                        ) : (
                            dates.map((date: any) => (
                                <button
                                    key={date}
                                    onClick={() => setSelectedDate(date)}
                                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all border shrink-0 ${
                                        selectedDate === date
                                            ? 'bg-white border-medical-blue text-medical-blue shadow-lg'
                                             : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <Calendar size={16} />
                                    <span className="font-bold text-sm">{new Date(date).toLocaleDateString()}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="lg:col-span-9 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8">
                        <div className="space-y-6">
                            {filteredDocs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                                    <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                                        <Plus size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 font-inter">No documents uploaded yet</h3>
                                </div>
                            ) : (
                                filteredDocs.map((doc) => (
                                    <div key={doc.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-medical-blue/10 flex items-center justify-center text-medical-blue shrink-0">
                                                    {doc.file_url ? <ImageIcon size={24} /> : <MessageSquare size={24} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900">{doc.title}</h4>
                                                    <p className="text-sm text-slate-500 mt-1">{doc.text_content}</p>
                                                    {doc.file_url && (
                                                        <a 
                                                            href={doc.file_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 mt-4 text-xs font-black text-medical-blue uppercase tracking-widest hover:underline"
                                                        >
                                                            <Download size={14} /> View Document
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(doc.id, doc.file_url)}
                                                className="p-2 rounded-xl text-slate-300 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowUploadModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black text-slate-900">Upload Record</h2>
                                <button onClick={() => setShowUploadModal(false)} className="p-2 rounded-full hover:bg-slate-100"><X size={20}/></button>
                            </div>

                            <form onSubmit={handleFileUpload} className="space-y-6">
                                {error && (
                                    <div className="bg-rose-50 text-rose-500 text-xs font-bold p-4 rounded-2xl flex items-center gap-3">
                                        <AlertCircle size={16} /> {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Health Note / Context</label>
                                    <textarea
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                        placeholder="E.g. Prescription from Dr. Smith"
                                        className="w-full h-24 p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-medical-blue focus:outline-none text-sm transition-all"
                                    />
                                </div>

                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center cursor-pointer hover:bg-slate-50"
                                >
                                    <input type="file" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="hidden" accept="image/*,application/pdf" />
                                    <Upload size={32} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm font-bold text-slate-500">{selectedFile ? selectedFile.name : "Click to select PDF or Image"}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase">Max 5MB</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-medical-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    {uploading ? "Uploading..." : "Confirm Upload"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Documents;
