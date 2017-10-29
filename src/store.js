const store = new Map();

function storeBadge(type, project, status) {
  if (!store.has(type)) {
    store.set(type, new Map());
  }
  const typeStore = store.get(type);
  if (!typeStore.has(project)) {
    typeStore.set(project, []);
  }
  const projectStore = typeStore.get(project);

  projectStore.push({
    status,
    date: Date.now()
  });
}

function getLastValue(type, project) {
  if (!store.has(type)) {
    return null;
  }

  const typeStore = store.get(type);

  if (!typeStore.has(project)) {
    return null;
  }

  const projectStore = typeStore.get(project);
  return projectStore.slice(-1)[0].status;
}

module.exports = {
  store: storeBadge,
  getLast: getLastValue
};
