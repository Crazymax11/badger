function getLink(meta) {
  return `https://img.shields.io/badge/${meta.subject
    .replace('-', '--')
    .replace('_', '__')
    .replace(' ', '_')}-${meta.status}-${meta.color}.svg`;
}

module.exports = getLink;
