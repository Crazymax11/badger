function getLink(meta) {
  return `https://img.shields.io/badge/${meta.subject
    .replace(/-/g, '--')
    .replace(/_/g, '__')
    .replace(/ /g, '_')}-${meta.status}-${meta.color}.svg`;
}

module.exports = getLink;
