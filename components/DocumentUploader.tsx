import React, { useState, useRef } from 'react';
import { Upload, File, X, Check, AlertTriangle, Loader2, Download, Trash2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface DocumentUploaderProps {
  candidateId: string;
  onDocumentsChange?: (documents: UploadedDocument[]) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ candidateId, onDocumentsChange }) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragOverRef = useRef(false);

  // Allowed file types
  const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Load existing documents
  React.useEffect(() => {
    loadDocuments();
  }, [candidateId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('uploaded_documents')
        .eq('candidate_id', candidateId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.uploaded_documents) {
        setDocuments(data.uploaded_documents);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Hanya file PDF dan Word yang diizinkan'
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'Ukuran file maksimal 5MB'
      };
    }

    return { valid: true };
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);

      if (!validation.valid) {
        setError(`${file.name}: ${validation.error}`);
        continue;
      }

      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${candidateId}/${Date.now()}_${file.name}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('candidate-documents')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('candidate-documents')
        .getPublicUrl(fileName);

      // Add to documents list
      const newDocument: UploadedDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString()
      };

      const updatedDocuments = [...documents, newDocument];
      setDocuments(updatedDocuments);
      setSuccess(`${file.name} berhasil diunggah`);

      // Notify parent component
      onDocumentsChange?.(updatedDocuments);

      // Update database
      await supabase
        .from('submissions')
        .update({ uploaded_documents: updatedDocuments })
        .eq('candidate_id', candidateId);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(`Gagal mengunggah ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;

    try {
      const updatedDocuments = documents.filter(d => d.id !== docId);
      setDocuments(updatedDocuments);

      // Update database
      await supabase
        .from('submissions')
        .update({ uploaded_documents: updatedDocuments })
        .eq('candidate_id', candidateId);

      // Delete from storage
      const docToDelete = documents.find(d => d.id === docId);
      if (docToDelete) {
        const fileName = docToDelete.url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('candidate-documents')
            .remove([`${candidateId}/${fileName}`]);
        }
      }

      setSuccess('Dokumen berhasil dihapus');
      onDocumentsChange?.(updatedDocuments);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Gagal menghapus dokumen');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📎';
  };

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-600" />
          <p className="text-red-800 font-semibold text-sm">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <Check size={20} className="text-green-600" />
          <p className="text-green-800 font-semibold text-sm">{success}</p>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          dragOverRef.current = true;
        }}
        onDragLeave={() => {
          dragOverRef.current = false;
        }}
        onDrop={(e) => {
          e.preventDefault();
          dragOverRef.current = false;
          handleFileSelect(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOverRef.current
            ? 'border-mobeng-blue bg-blue-50'
            : 'border-slate-300 hover:border-mobeng-blue hover:bg-blue-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center gap-3">
          <Upload size={32} className="text-mobeng-blue" />
          <div>
            <p className="font-bold text-slate-900">Drag & drop dokumen di sini</p>
            <p className="text-sm text-slate-600">atau klik untuk memilih file</p>
          </div>
          <p className="text-xs text-slate-500">
            Format: PDF, Word | Ukuran maksimal: 5MB
          </p>
        </div>
      </div>

      {/* Loading State */}
      {uploading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={24} className="animate-spin text-mobeng-blue mr-2" />
          <span className="text-slate-600 font-semibold">Mengunggah dokumen...</span>
        </div>
      )}

      {/* Documents List */}
      {!loading && documents.length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">Dokumen yang Diunggah ({documents.length})</p>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(doc.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-600">
                      {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                    title="Download"
                  >
                    <Download size={18} />
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                    title="Hapus"
                    disabled={uploading}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && documents.length === 0 && (
        <div className="text-center py-4">
          <p className="text-slate-600 text-sm">Belum ada dokumen yang diunggah</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={24} className="animate-spin text-mobeng-blue" />
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
