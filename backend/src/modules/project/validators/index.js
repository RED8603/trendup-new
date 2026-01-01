const projectValidator = require('./project.validator');
const documentValidator = require('./document.validator');

module.exports = {
    ...projectValidator,
    ...documentValidator,
};
