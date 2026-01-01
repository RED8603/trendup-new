import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyProjectsQuery, useDeleteProjectMutation } from '../../api/slices/projectApi';
import { ProjectCard } from '../../components/Project';
import './ProjectList.css';

const ProjectList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useGetMyProjectsQuery({ page, limit: 12 });
    const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const projects = data?.data?.projects || [];
    const pagination = data?.data?.pagination;

    const handleProjectClick = (project) => {
        navigate(`/projects/${project._id}`);
    };

    const handleEdit = (project) => {
        navigate(`/projects/${project._id}/edit`);
    };

    const handleDelete = async (project) => {
        if (deleteConfirm === project._id) {
            try {
                await deleteProject(project._id).unwrap();
                setDeleteConfirm(null);
            } catch (error) {
                console.error('Failed to delete project:', error);
            }
        } else {
            setDeleteConfirm(project._id);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="project-list-page">
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>Loading your projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-list-page">
                <div className="error-container">
                    <h2>Error loading projects</h2>
                    <p>{error.data?.message || 'Something went wrong'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="project-list-page">
            <div className="project-list-container">
                <div className="list-header">
                    <div>
                        <h1>My Projects</h1>
                        <p>{pagination?.total || 0} project{pagination?.total !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        className="create-btn"
                        onClick={() => navigate('/projects/create')}
                    >
                        + Create Project
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📁</div>
                        <h2>No projects yet</h2>
                        <p>Create your first project to get started</p>
                        <button
                            className="create-btn-large"
                            onClick={() => navigate('/projects/create')}
                        >
                            Create Your First Project
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="projects-grid">
                            {projects.map((project) => (
                                <div key={project._id} className="project-card-wrapper">
                                    <ProjectCard
                                        project={project}
                                        onClick={handleProjectClick}
                                        showActions={true}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                    {deleteConfirm === project._id && (
                                        <div className="delete-confirm">
                                            Click delete again to confirm
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {pagination && pagination.pages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {page} of {pagination.pages}
                                </span>
                                <button
                                    className="page-btn"
                                    disabled={page >= pagination.pages}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectList;
