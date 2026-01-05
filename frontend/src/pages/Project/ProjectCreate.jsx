import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useCreateProjectMutation,
    useUploadDocumentMutation,
} from '../../api/slices/projectApi';
import { ModuleToggle, DocumentUpload } from '../../components/Project';
import './ProjectCreate.css';

const BLOCKCHAINS = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'bsc', label: 'BNB Chain' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'optimism', label: 'Optimism' },
    { value: 'avalanche', label: 'Avalanche' },
    { value: 'solana', label: 'Solana' },
    { value: 'other', label: 'Other' },
];

const ProjectCreate = () => {
    const navigate = useNavigate();
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
    const logoInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        logo: null,
        logoPreview: null,
        links: {
            website: '',
            twitter: '',
            discord: '',
            telegram: '',
            github: '',
            medium: '',
            reddit: '',
        },
        contractAddress: '',
        blockchain: 'ethereum',
        walletAddress: '',
        enabledModules: {
            governance: false,
            tokenDetails: false,
            claimsRoadmap: false,
            audits: false,
            treasury: false,
            team: true,
            whitepaper: false,
            socialLinks: true,
        },
    });

    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);
    const [createdProjectId, setCreatedProjectId] = useState(null);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleLinkChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            links: { ...prev.links, [field]: value },
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                logo: file,
                logoPreview: URL.createObjectURL(file),
            }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }
        if (formData.name.length > 100) {
            newErrors.name = 'Name cannot exceed 100 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        }
    };

    const handleBack = () => {
        setStep(prev => Math.max(1, prev - 1));
    };

    const handleSubmit = async () => {
        try {
            const projectData = {
                name: formData.name,
                description: formData.description,
                shortDescription: formData.shortDescription,
                links: formData.links,
                contractAddress: formData.contractAddress,
                blockchain: formData.blockchain,
                walletAddress: formData.walletAddress,
                enabledModules: formData.enabledModules,
            };

            const result = await createProject(projectData).unwrap();
            setCreatedProjectId(result.data.project._id);
            setStep(4); // Move to document upload step
        } catch (error) {
            console.error('Failed to create project:', error);
            setErrors({ submit: error.data?.message || 'Failed to create project' });
        }
    };

    const handleDocumentUpload = async (formData) => {
        if (!createdProjectId) return;

        try {
            await uploadDocument({
                projectId: createdProjectId,
                formData,
            }).unwrap();
        } catch (error) {
            console.error('Failed to upload document:', error);
        }
    };

    const handleFinish = () => {
        navigate(`/projects/${createdProjectId}`);
    };

    return (
        <div className="project-create-page">
            <div className="project-create-container">
                <div className="create-header">
                    <h1>Create New Project</h1>
                    <div className="step-indicator">
                        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Basic Info</span>
                        </div>
                        <div className="step-divider" />
                        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Links & Details</span>
                        </div>
                        <div className="step-divider" />
                        <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                            <span className="step-number">3</span>
                            <span className="step-label">Modules</span>
                        </div>
                        <div className="step-divider" />
                        <div className={`step ${step >= 4 ? 'active' : ''}`}>
                            <span className="step-number">4</span>
                            <span className="step-label">Documents</span>
                        </div>
                    </div>
                </div>

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="form-step">
                        <h2>Basic Information</h2>

                        <div className="form-group">
                            <label htmlFor="name">Project Name *</label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Enter your project name"
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="shortDescription">Short Description</label>
                            <input
                                id="shortDescription"
                                type="text"
                                value={formData.shortDescription}
                                onChange={(e) => handleChange('shortDescription', e.target.value)}
                                placeholder="Brief one-liner about your project"
                                maxLength={300}
                            />
                            <span className="char-count">{formData.shortDescription.length}/300</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Full Description</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Detailed description of your project..."
                                rows={6}
                                maxLength={5000}
                            />
                            <span className="char-count">{formData.description.length}/5000</span>
                        </div>

                        <div className="form-group">
                            <label>Project Logo</label>
                            <div
                                className="logo-upload"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                {formData.logoPreview ? (
                                    <img src={formData.logoPreview} alt="Logo preview" className="logo-preview" />
                                ) : (
                                    <div className="logo-placeholder">
                                        <span className="upload-icon">🖼️</span>
                                        <span>Click to upload logo</span>
                                    </div>
                                )}
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn-primary" onClick={handleNext}>
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Links & Details */}
                {step === 2 && (
                    <div className="form-step">
                        <h2>Links & Contract Details</h2>

                        <div className="form-section">
                            <h3>Social Links</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Website</label>
                                    <input
                                        type="url"
                                        value={formData.links.website}
                                        onChange={(e) => handleLinkChange('website', e.target.value)}
                                        placeholder="https://yourproject.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Twitter</label>
                                    <input
                                        type="text"
                                        value={formData.links.twitter}
                                        onChange={(e) => handleLinkChange('twitter', e.target.value)}
                                        placeholder="@yourproject"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Discord</label>
                                    <input
                                        type="text"
                                        value={formData.links.discord}
                                        onChange={(e) => handleLinkChange('discord', e.target.value)}
                                        placeholder="Discord invite link"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Telegram</label>
                                    <input
                                        type="text"
                                        value={formData.links.telegram}
                                        onChange={(e) => handleLinkChange('telegram', e.target.value)}
                                        placeholder="Telegram group link"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>GitHub</label>
                                    <input
                                        type="text"
                                        value={formData.links.github}
                                        onChange={(e) => handleLinkChange('github', e.target.value)}
                                        placeholder="GitHub organization/repo"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Medium</label>
                                    <input
                                        type="text"
                                        value={formData.links.medium}
                                        onChange={(e) => handleLinkChange('medium', e.target.value)}
                                        placeholder="Medium blog URL"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Contract Details</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Blockchain</label>
                                    <select
                                        value={formData.blockchain}
                                        onChange={(e) => handleChange('blockchain', e.target.value)}
                                    >
                                        {BLOCKCHAINS.map(bc => (
                                            <option key={bc.value} value={bc.value}>{bc.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Contract Address</label>
                                    <input
                                        type="text"
                                        value={formData.contractAddress}
                                        onChange={(e) => handleChange('contractAddress', e.target.value)}
                                        placeholder="0x..."
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Treasury Wallet Address</label>
                                    <input
                                        type="text"
                                        value={formData.walletAddress}
                                        onChange={(e) => handleChange('walletAddress', e.target.value)}
                                        placeholder="0x..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn-secondary" onClick={handleBack}>
                                Back
                            </button>
                            <button className="btn-primary" onClick={handleNext}>
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Modules */}
                {step === 3 && (
                    <div className="form-step">
                        <h2>Configure Modules</h2>
                        <p className="step-description">
                            Enable the modules you want to display on your project page
                        </p>

                        <ModuleToggle
                            enabledModules={formData.enabledModules}
                            onChange={(modules) => handleChange('enabledModules', modules)}
                        />

                        {errors.submit && (
                            <div className="error-banner">{errors.submit}</div>
                        )}

                        <div className="form-actions">
                            <button className="btn-secondary" onClick={handleBack}>
                                Back
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleSubmit}
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Documents */}
                {step === 4 && (
                    <div className="form-step">
                        <div className="success-message">
                            <span className="success-icon">✅</span>
                            <h2>Project Created Successfully!</h2>
                            <p>Now upload your project documents</p>
                        </div>

                        <DocumentUpload
                            onUpload={handleDocumentUpload}
                            isUploading={isUploading}
                            existingDocuments={[]}
                        />

                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => navigate('/projects/my')}>
                                Skip for now
                            </button>
                            <button className="btn-primary" onClick={handleFinish}>
                                View Project
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCreate;
