/**
 * @typedef {Object} ArchitectureNode
 * @property {string} id
 * @property {string} label
 * @property {string} type - 'frontend|backend|database|cache|queue|external|storage|gateway|service'
 * @property {string} technology
 * @property {string} role
 * @property {string} why
 * @property {number} position.x
 * @property {number} position.y
 */

/**
 * @typedef {Object} ArchitectureEdge
 * @property {string} source
 * @property {string} target
 * @property {string} label - 'HTTP|data|event|response'
 * @property {string} description
 */

/**
 * @typedef {Object} Architecture
 * @property {number} id
 * @property {string} title
 * @property {string} prompt_input
 * @property {string} tech_stack
 * @property {Object} diagram_json
 * @property {ArchitectureNode[]} diagram_json.nodes
 * @property {ArchitectureEdge[]} diagram_json.edges
 * @property {string[]} diagram_json.flow
 * @property {Object[]} diagram_json.decisions
 * @property {Object} tradeoffs_json
 * @property {string} share_slug
 * @property {boolean} is_public
 */