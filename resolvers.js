import fs from "fs";

// Load sample data
const nodes = JSON.parse(fs.readFileSync("./node.json"));
const actions = JSON.parse(fs.readFileSync("./action.json"));
const triggers = JSON.parse(fs.readFileSync("./trigger.json")); // if you have triggers

export const resolvers = {
  Query: {
    node: (_, { nodeId }) => nodes.find(n => n._id === nodeId),
    allNodes: () => nodes,
  },
  NodeObject: {
    parents: (node) =>
      node.parents?.map(pid => nodes.find(n => n._id === pid)) || [],
    actions: (node) =>
      node.postActions?.map(aid => actions.find(a => a._id === aid)) || [],
    trigger: (node) =>
      node.trigger ? triggers.find(t => t._id === node.trigger) : null,
    responses: (node) => node.responseIds || [],
  },
};
