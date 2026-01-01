import React from 'react';
import './ChangeHistoryItem.css';

const ChangeHistoryItem = ({ change }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) return 'Just now';
        // Less than 1 hour
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
        // Less than 24 hours
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        // Less than 7 days
        if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const getChangeIcon = (changeType) => {
        const icons = {
            create: '✨',
            update: '✏️',
            delete: '🗑️',
            restore: '♻️',
            publish: '🚀',
            unpublish: '📥',
            document_add: '📎',
            document_remove: '📤',
            module_toggle: '⚙️',
            team_add: '👤➕',
            team_remove: '👤➖',
            team_update: '👤✏️',
            verification: '✓',
            ownership_transfer: '🔄',
        };
        return icons[changeType] || '📝';
    };

    const getChangeDescription = (change) => {
        const descriptions = {
            create: 'Created the project',
            update: `Updated ${change.fieldChanged || 'project'}`,
            delete: 'Deleted the project',
            restore: 'Restored the project',
            publish: 'Published the project',
            unpublish: 'Unpublished the project',
            document_add: 'Added a document',
            document_remove: 'Removed a document',
            module_toggle: 'Changed module settings',
            team_add: 'Added a team member',
            team_remove: 'Removed a team member',
            team_update: 'Updated team member role',
            verification: 'Project was verified',
            ownership_transfer: 'Transferred ownership',
        };
        return change.description || descriptions[change.changeType] || 'Made a change';
    };

    const getChangeColor = (changeType) => {
        const colors = {
            create: '#22c55e',
            update: '#6366f1',
            delete: '#ef4444',
            publish: '#22c55e',
            document_add: '#3b82f6',
            team_add: '#8b5cf6',
        };
        return colors[changeType] || '#6b7280';
    };

    return (
        <div className="change-history-item">
            <div
                className="change-icon"
                style={{ background: `${getChangeColor(change.changeType)}20`, color: getChangeColor(change.changeType) }}
            >
                {getChangeIcon(change.changeType)}
            </div>

            <div className="change-content">
                <div className="change-header">
                    <span className="change-description">{getChangeDescription(change)}</span>
                    <span className="change-time">{formatDate(change.createdAt)}</span>
                </div>

                {change.user && (
                    <div className="change-user">
                        {change.user.avatar ? (
                            <img src={change.user.avatar} alt={change.user.name} className="user-avatar" />
                        ) : (
                            <div className="user-avatar-placeholder">
                                {change.user.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <span className="user-name">{change.user.name || change.user.username}</span>
                    </div>
                )}

                {/* Show before/after values for updates */}
                {change.changeType === 'update' && change.oldValue && change.newValue && (
                    <div className="change-values">
                        <div className="value-old">
                            <span className="value-label">Before:</span>
                            <span className="value-text">
                                {typeof change.oldValue === 'object' ? JSON.stringify(change.oldValue) : String(change.oldValue)}
                            </span>
                        </div>
                        <div className="value-new">
                            <span className="value-label">After:</span>
                            <span className="value-text">
                                {typeof change.newValue === 'object' ? JSON.stringify(change.newValue) : String(change.newValue)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangeHistoryItem;
