function escape(str) {
  return str
    .replace(/-/g, '--')
    .replace(/_/g, '__')
    .replace(/ /g, '_ ');
}
function getLink(meta) {
  const status = escape(meta.status);
  const subject = escape(meta.subject);
  const color = meta.color;
  return `https://img.shields.io/badge/${subject}-${status}-${color}.svg`;
}

module.exports = getLink;
