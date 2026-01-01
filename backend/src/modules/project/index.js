const { projectRoutes, documentRoutes, changeHistoryRoutes } = require('./routes');
const { Project, Document, ChangeHistory } = require('./models');
const { projectService, documentService, changeHistoryService } = require('./services');

module.exports = {
    // Routes
    projectRoutes,
    documentRoutes,
    changeHistoryRoutes,

    // Models
    Project,
    Document,
    ChangeHistory,

    // Services
    projectService,
    documentService,
    changeHistoryService,
};
