import { baseApi } from "../baseApi";

export const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ==================== Project CRUD ====================

        // Get all projects with filters
        getProjects: builder.query({
            query: ({ page = 1, limit = 20, status, isPublic, isVerified, search, blockchain, sortBy, sortOrder } = {}) => {
                const params = new URLSearchParams();
                params.append('page', page);
                params.append('limit', limit);
                if (status) params.append('status', status);
                if (isPublic !== undefined) params.append('isPublic', isPublic);
                if (isVerified !== undefined) params.append('isVerified', isVerified);
                if (search) params.append('search', search);
                if (blockchain) params.append('blockchain', blockchain);
                if (sortBy) params.append('sortBy', sortBy);
                if (sortOrder) params.append('sortOrder', sortOrder);

                return `/projects?${params.toString()}`;
            },
            providesTags: (result) =>
                result?.data?.projects
                    ? [
                        ...result.data.projects.map(({ _id }) => ({ type: 'Projects', id: _id })),
                        { type: 'Projects', id: 'LIST' },
                    ]
                    : [{ type: 'Projects', id: 'LIST' }],
        }),

        // Get current user's projects
        getMyProjects: builder.query({
            query: ({ page = 1, limit = 20 } = {}) => `/projects/my/projects?page=${page}&limit=${limit}`,
            providesTags: (result) =>
                result?.data?.projects
                    ? [
                        ...result.data.projects.map(({ _id }) => ({ type: 'Projects', id: _id })),
                        { type: 'Projects', id: 'MY_LIST' },
                    ]
                    : [{ type: 'Projects', id: 'MY_LIST' }],
        }),

        // Get single project by ID
        getProject: builder.query({
            query: (id) => `/projects/${id}`,
            providesTags: (result, error, id) => [{ type: 'Projects', id }],
        }),

        // Get project by slug (public)
        getProjectBySlug: builder.query({
            query: (slug) => `/projects/slug/${slug}`,
            providesTags: (result) =>
                result?.data?.project
                    ? [{ type: 'Projects', id: result.data.project._id }]
                    : [],
        }),

        // Create new project
        createProject: builder.mutation({
            query: (projectData) => ({
                url: '/projects',
                method: 'POST',
                body: projectData,
            }),
            invalidatesTags: [{ type: 'Projects', id: 'LIST' }, { type: 'Projects', id: 'MY_LIST' }],
        }),

        // Update project
        updateProject: builder.mutation({
            query: ({ id, ...projectData }) => ({
                url: `/projects/${id}`,
                method: 'PUT',
                body: projectData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Projects', id },
                { type: 'Projects', id: 'LIST' },
                { type: 'Projects', id: 'MY_LIST' },
            ],
        }),

        // Delete project
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Projects', id },
                { type: 'Projects', id: 'LIST' },
                { type: 'Projects', id: 'MY_LIST' },
            ],
        }),

        // Update module configuration
        updateModules: builder.mutation({
            query: ({ id, ...modules }) => ({
                url: `/projects/${id}/modules`,
                method: 'PATCH',
                body: modules,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Projects', id }],
        }),

        // Publish project
        publishProject: builder.mutation({
            query: (id) => ({
                url: `/projects/${id}/publish`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Projects', id },
                { type: 'Projects', id: 'LIST' },
            ],
        }),

        // ==================== Team Management ====================

        // Add team member
        addTeamMember: builder.mutation({
            query: ({ projectId, memberId, role }) => ({
                url: `/projects/${projectId}/team`,
                method: 'POST',
                body: { memberId, role },
            }),
            invalidatesTags: (result, error, { projectId }) => [{ type: 'Projects', id: projectId }],
        }),

        // Remove team member
        removeTeamMember: builder.mutation({
            query: ({ projectId, memberId }) => ({
                url: `/projects/${projectId}/team/${memberId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { projectId }) => [{ type: 'Projects', id: projectId }],
        }),

        // ==================== Documents ====================

        // Get project documents
        getProjectDocuments: builder.query({
            query: ({ projectId, documentType } = {}) => {
                const params = new URLSearchParams();
                if (documentType) params.append('documentType', documentType);
                return `/projects/${projectId}/documents?${params.toString()}`;
            },
            providesTags: (result, error, { projectId }) =>
                result?.data?.documents
                    ? [
                        ...result.data.documents.map(({ _id }) => ({ type: 'ProjectDocuments', id: _id })),
                        { type: 'ProjectDocuments', id: projectId },
                    ]
                    : [{ type: 'ProjectDocuments', id: projectId }],
        }),

        // Upload document
        uploadDocument: builder.mutation({
            query: ({ projectId, formData }) => ({
                url: `/projects/${projectId}/documents`,
                method: 'POST',
                body: formData,
                formData: true,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectDocuments', id: projectId },
                { type: 'Projects', id: projectId },
            ],
        }),

        // Update document metadata
        updateDocument: builder.mutation({
            query: ({ projectId, documentId, ...data }) => ({
                url: `/projects/${projectId}/documents/${documentId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { projectId, documentId }) => [
                { type: 'ProjectDocuments', id: documentId },
                { type: 'ProjectDocuments', id: projectId },
            ],
        }),

        // Delete document
        deleteDocument: builder.mutation({
            query: ({ projectId, documentId }) => ({
                url: `/projects/${projectId}/documents/${documentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: 'ProjectDocuments', id: projectId },
                { type: 'Projects', id: projectId },
            ],
        }),

        // ==================== Change History ====================

        // Get project change history
        getProjectHistory: builder.query({
            query: ({ projectId, page = 1, limit = 20, changeType } = {}) => {
                const params = new URLSearchParams();
                params.append('page', page);
                params.append('limit', limit);
                if (changeType) params.append('changeType', changeType);
                return `/projects/${projectId}/history?${params.toString()}`;
            },
            providesTags: (result, error, { projectId }) => [
                { type: 'ProjectHistory', id: projectId },
            ],
        }),

        // Get my activity
        getMyActivity: builder.query({
            query: ({ page = 1, limit = 20 } = {}) => `/projects/activity/me?page=${page}&limit=${limit}`,
            providesTags: [{ type: 'ProjectHistory', id: 'MY_ACTIVITY' }],
        }),

        // Get project change stats
        getProjectHistoryStats: builder.query({
            query: (projectId) => `/projects/${projectId}/history/stats`,
            providesTags: (result, error, projectId) => [
                { type: 'ProjectHistory', id: `${projectId}_STATS` },
            ],
        }),
    }),
});

export const {
    // Project queries
    useGetProjectsQuery,
    useGetMyProjectsQuery,
    useGetProjectQuery,
    useGetProjectBySlugQuery,
    useLazyGetProjectBySlugQuery,

    // Project mutations
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useUpdateModulesMutation,
    usePublishProjectMutation,

    // Team mutations
    useAddTeamMemberMutation,
    useRemoveTeamMemberMutation,

    // Document queries
    useGetProjectDocumentsQuery,

    // Document mutations
    useUploadDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation,

    // History queries
    useGetProjectHistoryQuery,
    useGetMyActivityQuery,
    useGetProjectHistoryStatsQuery,
} = projectApi;
