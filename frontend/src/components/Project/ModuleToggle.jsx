import React from 'react';
import './ModuleToggle.css';

const MODULES = [
    { key: 'governance', label: 'Governance', description: 'Enable governance features and voting' },
    { key: 'tokenDetails', label: 'Token Details', description: 'Show token information and metrics' },
    { key: 'claimsRoadmap', label: 'Claims/Roadmap', description: 'Display project roadmap and milestones' },
    { key: 'audits', label: 'Audits', description: 'Show security audits and reports' },
    { key: 'treasury', label: 'Treasury', description: 'Display treasury information' },
    { key: 'team', label: 'Team', description: 'Show team members section' },
    { key: 'whitepaper', label: 'Whitepaper', description: 'Link to project whitepaper' },
    { key: 'socialLinks', label: 'Social Links', description: 'Display social media links' },
];

const ModuleToggle = ({ enabledModules = {}, onChange, disabled = false }) => {
    const handleToggle = (moduleKey) => {
        if (disabled) return;
        onChange({
            ...enabledModules,
            [moduleKey]: !enabledModules[moduleKey],
        });
    };

    return (
        <div className="module-toggle-container">
            <h3 className="module-toggle-title">Module Configuration</h3>
            <p className="module-toggle-subtitle">Enable or disable sections for your project</p>

            <div className="module-toggle-grid">
                {MODULES.map((module) => (
                    <div
                        key={module.key}
                        className={`module-toggle-item ${enabledModules[module.key] ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                        onClick={() => handleToggle(module.key)}
                    >
                        <div className="module-toggle-header">
                            <span className="module-toggle-label">{module.label}</span>
                            <div className={`toggle-switch ${enabledModules[module.key] ? 'on' : ''}`}>
                                <div className="toggle-slider" />
                            </div>
                        </div>
                        <p className="module-toggle-description">{module.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModuleToggle;
