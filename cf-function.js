function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // If URI has no extension and doesn't end with /
  if (!uri.includes('.') && !uri.endsWith('/')) {
    request.uri = uri + '.html';
  }
  // If URI ends with /
  else if (uri.endsWith('/') && uri !== '/') {
    request.uri = uri.slice(0, -1) + '.html';
  }

  return request;
}
