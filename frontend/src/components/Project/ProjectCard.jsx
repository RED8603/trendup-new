import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project, onClick, showActions = false, onEdit, onDelete }) => {
    const getStatusBadge = (status) => {
        const statusStyles = {
            draft: { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308' },
            published: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
            archived: { bg: 'rgba(107, 114, 128, 0.2)', color: '#6b7280' },
        };
        return statusStyles[status] || statusStyles.draft;
    };

    const statusStyle = getStatusBadge(project.status);

    return (
        <div className="project-card" onClick={() => onClick?.(project)}>
            <div className="project-card-header">
                {project.logo ? (
                    <img src={project.logo} alt={project.name} className="project-logo" />
                ) : (
                    <div className="project-logo-placeholder">
                        {project.name?.charAt(0)?.toUpperCase() || 'P'}
                    </div>
                )}

                <div className="project-info">
                    <h3 className="project-name">{project.name}</h3>
                    <span className="project-slug">/{project.slug}</span>
                </div>

                <div
                    className="project-status"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                >
                    {project.status}
                </div>
            </div>

            {project.shortDescription && (
                <p className="project-description">{project.shortDescription}</p>
            )}

            <div className="project-meta">
                <span className="meta-item">
                    <span className="meta-icon">👁️</span>
                    {project.viewsCount || 0} views
                </span>
                <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    {new Date(project.createdAt).toLocaleDateString()}
                </span>
                {project.isVerified && (
                    <span className="verified-badge">✓ Verified</span>
                )}
            </div>

            {/* Module Indicators */}
            <div className="project-modules">
                {project.enabledModules?.governance && <span className="module-badge">Governance</span>}
                {project.enabledModules?.tokenDetails && <span className="module-badge">Token</span>}
                {project.enabledModules?.audits && <span className="module-badge">Audits</span>}
                {project.enabledModules?.treasury && <span className="module-badge">Treasury</span>}
            </div>

            {showActions && (
                <div className="project-actions">
                    <button
                        className="action-btn edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(project);
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className="action-btn delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(project);
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
