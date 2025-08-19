import fs from "fs";

// Load JSON data
const nodes = JSON.parse(fs.readFileSync("./node.json"));
const actions = JSON.parse(fs.readFileSync("./action.json"));
const triggers = JSON.parse(fs.readFileSync("./trigger.json"));
const responses = JSON.parse(fs.readFileSync("./response.json"));

export const resolvers = {
  Query: {
    node: (_, { nodeId }) => nodes.find(n => n._id === nodeId),
    allNodes: () => nodes,
  },
  NodeObject: {
    parents: (node) =>
      node.parentIds?.map(pid => nodes.find(n => n._id === pid)) || [],
    actions: (node) =>
      node.actionIds?.map(aid => actions.find(a => a._id === aid)) || [],
    trigger: (node) =>
      node.triggerId ? triggers.find(t => t._id === node.triggerId) : null,
    responses: (node) => {
      // If responseIds exist, map them, otherwise try to match by node name
      if (node.responseIds && node.responseIds.length > 0) {
        return node.responseIds.map(rid => responses.find(r => r._id === rid));
      } else {
        // Optional fallback: match all responses with the same node name
        return responses.filter(r => r.name === node.name);
      }
    },
  },
  Response: {
    platforms: (response) => response.platforms || [],
  },
  ResponsePlatform: {
    localeGroups: (platform) => platform.localeGroups || [],
  },
  ResponseLocaleGroup: {
    variations: (group) => group.variations || [],
  },
  ResponseVariation: {
    name: (variation) => variation.name || null,
    responses: (variation) => variation.responses || [],
  },
};
