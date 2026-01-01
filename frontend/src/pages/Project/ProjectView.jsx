import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    useGetProjectQuery,
    useGetProjectDocumentsQuery,
    useGetProjectHistoryQuery,
    usePublishProjectMutation,
} from '../../api/slices/projectApi';
import { ChangeHistoryItem } from '../../components/Project';
import './ProjectView.css';

const ProjectView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const { data: projectData, isLoading, error } = useGetProjectQuery(id);
    const { data: documentsData } = useGetProjectDocumentsQuery({ projectId: id });
    const { data: historyData } = useGetProjectHistoryQuery({ projectId: id, limit: 10 });
    const [publishProject, { isLoading: isPublishing }] = usePublishProjectMutation();

    const project = projectData?.data?.project;
    const documents = documentsData?.data?.documents || [];
    const history = historyData?.data?.history || [];

    const handlePublish = async () => {
        try {
            await publishProject(id).unwrap();
        } catch (error) {
            console.error('Failed to publish:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="project-view-page">
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>Loading project...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="project-view-page">
                <div className="error-container">
                    <h2>Project not found</h2>
                    <p>{error?.data?.message || 'This project may have been deleted or you don\'t have access.'}</p>
                    <Link to="/projects/my" className="back-link">← Back to my projects</Link>
                </div>
            </div>
        );
    }

    const isOwner = true; // TODO: Check against current user

    return (
        <div className="project-view-page">
            <div className="project-view-container">
                {/* Project Header */}
                <div className="project-header">
                    <div className="header-left">
                        {project.logo ? (
                            <img src={project.logo} alt={project.name} className="project-logo" />
                        ) : (
                            <div className="project-logo-placeholder">
                                {project.name?.charAt(0)?.toUpperCase()}
                            </div>
                        )}
                        <div className="header-info">
                            <div className="header-top">
                                <h1>{project.name}</h1>
                                <span className={`status-badge ${project.status}`}>{project.status}</span>
                                {project.isVerified && <span className="verified-badge">✓ Verified</span>}
                            </div>
                            <p className="project-slug">/{project.slug}</p>
                            {project.shortDescription && (
                                <p className="short-description">{project.shortDescription}</p>
                            )}
                        </div>
                    </div>

                    {isOwner && (
                        <div className="header-actions">
                            {project.status === 'draft' && (
                                <button
                                    className="publish-btn"
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                >
                                    {isPublishing ? 'Publishing...' : '🚀 Publish'}
                                </button>
                            )}
                            <button
                                className="edit-btn"
                                onClick={() => navigate(`/projects/${id}/edit`)}
                            >
                                ✏️ Edit
                            </button>
                        </div>
                    )}
                </div>

                {/* Stats Bar */}
                <div className="stats-bar">
                    <div className="stat">
                        <span className="stat-value">{project.viewsCount || 0}</span>
                        <span className="stat-label">Views</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{project.followersCount || 0}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{documents.length || 0}</span>
                        <span className="stat-label">Documents</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{new Date(project.createdAt).toLocaleDateString()}</span>
                        <span className="stat-label">Created</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    {project.enabledModules?.tokenDetails && (
                        <button
                            className={`tab ${activeTab === 'token' ? 'active' : ''}`}
                            onClick={() => setActiveTab('token')}
                        >
                            Token Details
                        </button>
                    )}
                    {project.enabledModules?.team && (
                        <button
                            className={`tab ${activeTab === 'team' ? 'active' : ''}`}
                            onClick={() => setActiveTab('team')}
                        >
                            Team
                        </button>
                    )}
                    {project.enabledModules?.claimsRoadmap && (
                        <button
                            className={`tab ${activeTab === 'roadmap' ? 'active' : ''}`}
                            onClick={() => setActiveTab('roadmap')}
                        >
                            Roadmap
                        </button>
                    )}
                    <button
                        className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        Documents
                    </button>
                    {isOwner && (
                        <button
                            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            History
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="overview-section">
                            {/* Description */}
                            <div className="content-card">
                                <h2>About</h2>
                                <p className="description">{project.description || 'No description provided.'}</p>
                            </div>

                            {/* Links */}
                            {project.enabledModules?.socialLinks && project.links && (
                                <div className="content-card">
                                    <h2>Links</h2>
                                    <div className="links-grid">
                                        {project.links.website && (
                                            <a href={project.links.website} target="_blank" rel="noopener noreferrer" className="link-item">
                                                🌐 Website
                                            </a>
                                        )}
                                        {project.links.twitter && (
                                            <a href={`https://twitter.com/${project.links.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="link-item">
                                                𝕏 Twitter
                                            </a>
                                        )}
                                        {project.links.discord && (
                                            <a href={project.links.discord} target="_blank" rel="noopener noreferrer" className="link-item">
                                                💬 Discord
                                            </a>
                                        )}
                                        {project.links.telegram && (
                                            <a href={project.links.telegram} target="_blank" rel="noopener noreferrer" className="link-item">
                                                📱 Telegram
                                            </a>
                                        )}
                                        {project.links.github && (
                                            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="link-item">
                                                💻 GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Contract Info */}
                            {project.contractAddress && (
                                <div className="content-card">
                                    <h2>Contract Information</h2>
                                    <div className="contract-info">
                                        <div className="info-row">
                                            <span className="label">Blockchain:</span>
                                            <span className="value">{project.blockchain}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Contract:</span>
                                            <span className="value address">{project.contractAddress}</span>
                                        </div>
                                        {project.walletAddress && (
                                            <div className="info-row">
                                                <span className="label">Treasury:</span>
                                                <span className="value address">{project.walletAddress}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'token' && project.tokenInfo && (
                        <div className="content-card">
                            <h2>Token Details</h2>
                            <div className="token-grid">
                                <div className="token-item">
                                    <span className="token-label">Name</span>
                                    <span className="token-value">{project.tokenInfo.name || 'N/A'}</span>
                                </div>
                                <div className="token-item">
                                    <span className="token-label">Symbol</span>
                                    <span className="token-value">{project.tokenInfo.symbol || 'N/A'}</span>
                                </div>
                                <div className="token-item">
                                    <span className="token-label">Total Supply</span>
                                    <span className="token-value">{project.tokenInfo.totalSupply || 'N/A'}</span>
                                </div>
                                <div className="token-item">
                                    <span className="token-label">Circulating Supply</span>
                                    <span className="token-value">{project.tokenInfo.circulatingSupply || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div className="content-card">
                            <h2>Team Members</h2>
                            {project.team && project.team.length > 0 ? (
                                <div className="team-grid">
                                    {project.team.map((member, index) => (
                                        <div key={index} className="team-member">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="member-avatar" />
                                            ) : (
                                                <div className="member-avatar-placeholder">
                                                    {member.name?.charAt(0)}
                                                </div>
                                            )}
                                            <h4>{member.name}</h4>
                                            <p className="member-role">{member.role}</p>
                                            <div className="member-links">
                                                {member.twitter && (
                                                    <a href={`https://twitter.com/${member.twitter}`} target="_blank" rel="noopener noreferrer">𝕏</a>
                                                )}
                                                {member.linkedin && (
                                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">in</a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-text">No team members added yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'roadmap' && (
                        <div className="content-card">
                            <h2>Roadmap</h2>
                            {project.roadmap && project.roadmap.length > 0 ? (
                                <div className="roadmap-timeline">
                                    {project.roadmap.map((item, index) => (
                                        <div key={index} className={`roadmap-item ${item.status}`}>
                                            <div className="roadmap-marker" />
                                            <div className="roadmap-content">
                                                <span className="roadmap-date">{item.quarter} {item.year}</span>
                                                <h4>{item.title}</h4>
                                                <p>{item.description}</p>
                                                <span className={`roadmap-status ${item.status}`}>{item.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-text">No roadmap items added yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="content-card">
                            <h2>Documents</h2>
                            {documents.length > 0 ? (
                                <div className="documents-list">
                                    {documents.map((doc) => (
                                        <a
                                            key={doc._id}
                                            href={doc.s3Url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="document-item"
                                        >
                                            <span className="doc-icon">📄</span>
                                            <div className="doc-info">
                                                <span className="doc-name">{doc.originalName}</span>
                                                <span className="doc-type">{doc.documentType}</span>
                                            </div>
                                            <span className="download-icon">↓</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-text">No documents uploaded yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="content-card">
                            <h2>Change History</h2>
                            {history.length > 0 ? (
                                <div className="history-list">
                                    {history.map((change) => (
                                        <ChangeHistoryItem key={change._id} change={change} />
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-text">No changes recorded yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectView;
