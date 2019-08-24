import { DepGraph } from 'dependency-graph';
import mongoose from 'mongoose';

const models = {};
const info = {};

const seedModel = async (Model, deps) => {
  const modelInfo = info[Model.modelName];

  await Model.deleteMany({});

  return Model.create(modelInfo.seed(...deps));
};

const getSchemasOrder = () => {
  const graph = new DepGraph();

  Object.keys(models).forEach(modelName => graph.addNode(modelName));

  Object.keys(models).forEach(modelName => {
    info[modelName].dependencies.forEach(dep => graph.addDependency(modelName, dep));
  });

  return graph.overallOrder();
};

export const addSeed = (Model, { seed, dependencies = [] } = {}) => {
  if (!Model) {
    throw new TypeError('mongoose-plugin-seed: Model must be provided');
  }
  if (!seed) {
    throw new TypeError('mongoose-plugin-seed: seed function must be provided');
  }
  if (typeof seed !== 'function') {
    throw new TypeError('mongoose-plugin-seed: seed must be a function');
  }
  if (!Array.isArray(dependencies)) {
    throw new TypeError('mongoose-plugin-seed: dependencies must be an array');
  }

  models[Model.modelName] = Model;
  info[Model.modelName] = { dependencies: dependencies.map(({modelName}) => modelName), seed };
};

export default (name, Schema, rest) => {
  if (!name) {
    throw new TypeError('mongoose-plugin-seed: name must be provided');
  }
  else if (typeof name !== 'string') {
    throw new TypeError('mongoose-plugin-seed: name must be a string');
  }
  else if (!Schema) {
    throw new TypeError('mongoose-plugin-seed: Schema must be provided');
  }

  const Model = mongoose.model(name, Schema);

  addSeed(Model, rest);

  return Model;
};

export const seed = async () => {
  const order = getSchemasOrder();
  const seeds = {};

  return Promise.all(order.map(async modelName => {
    const Model = models[modelName];

    seeds[modelName] = Promise.all(info[modelName].dependencies.map(async dep => await seeds[dep]))
      .then(async deps => await seedModel(Model, deps));

    return seeds[modelName];
  }));
};
