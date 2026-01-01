import React, { useState, useRef } from 'react';
import './DocumentUpload.css';

const DOCUMENT_TYPES = [
    { value: 'whitepaper', label: 'Whitepaper' },
    { value: 'audit', label: 'Audit Report' },
    { value: 'tokenomics', label: 'Tokenomics' },
    { value: 'pitch_deck', label: 'Pitch Deck' },
    { value: 'legal', label: 'Legal Document' },
    { value: 'other', label: 'Other' },
];

const DocumentUpload = ({
    onUpload,
    isUploading = false,
    existingDocuments = [],
    onDeleteDocument
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentType, setDocumentType] = useState('whitepaper');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('documentType', documentType);
        formData.append('description', description);
        formData.append('isPublic', isPublic.toString());

        await onUpload(formData);

        // Reset form
        setSelectedFile(null);
        setDescription('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (type) => {
        if (type.includes('pdf')) return '📄';
        if (type.includes('word') || type.includes('doc')) return '📝';
        if (type.includes('presentation') || type.includes('ppt')) return '📊';
        if (type.includes('image')) return '🖼️';
        return '📎';
    };

    return (
        <div className="document-upload-container">
            <h3 className="document-upload-title">Documents</h3>

            {/* Upload Zone */}
            <div
                className={`upload-zone ${dragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                    style={{ display: 'none' }}
                />

                {selectedFile ? (
                    <div className="selected-file">
                        <span className="file-icon">{getFileIcon(selectedFile.type)}</span>
                        <div className="file-info">
                            <span className="file-name">{selectedFile.name}</span>
                            <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                        </div>
                        <button
                            className="remove-file"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon">📁</div>
                        <p className="upload-text">
                            Drag and drop your file here or <span>browse</span>
                        </p>
                        <p className="upload-hint">PDF, DOC, PPT, or images up to 50MB</p>
                    </>
                )}
            </div>

            {/* Upload Options */}
            {selectedFile && (
                <div className="upload-options">
                    <div className="option-group">
                        <label>Document Type</label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                        >
                            {DOCUMENT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="option-group">
                        <label>Description (optional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the document"
                            maxLength={500}
                        />
                    </div>

                    <div className="option-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            Make document publicly visible
                        </label>
                    </div>

                    <button
                        className="upload-button"
                        onClick={handleSubmit}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                </div>
            )}

            {/* Existing Documents */}
            {existingDocuments.length > 0 && (
                <div className="existing-documents">
                    <h4>Uploaded Documents</h4>
                    <div className="documents-list">
                        {existingDocuments.map((doc) => (
                            <div key={doc._id} className="document-item">
                                <span className="doc-icon">{getFileIcon(doc.mimeType)}</span>
                                <div className="doc-info">
                                    <a
                                        href={doc.s3Url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="doc-name"
                                    >
                                        {doc.originalName}
                                    </a>
                                    <span className="doc-meta">
                                        {doc.documentType} • {doc.formattedSize || formatFileSize(doc.size)}
                                        {!doc.isPublic && ' • Private'}
                                    </span>
                                </div>
                                {onDeleteDocument && (
                                    <button
                                        className="delete-doc"
                                        onClick={() => onDeleteDocument(doc._id)}
                                        title="Delete document"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
