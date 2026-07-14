const DEFAULT_API_TARGET = 'https://pacify-unpicked-unsafe.ngrok-free.dev';

export default async function handler(request, response) {
  const path = Array.isArray(request.query.path)
    ? request.query.path.join('/')
    : request.query.path || '';
  const target = (process.env.API_PROXY_TARGET || DEFAULT_API_TARGET).replace(/\/$/, '');
  const query = new URLSearchParams();

  Object.entries(request.query).forEach(([key, value]) => {
    if (key === 'path') return;
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value !== undefined) query.set(key, value);
  });

  const targetUrl = `${target}/${path}${query.size ? `?${query}` : ''}`;
  const headers = { ...request.headers };
  delete headers.host;
  delete headers.origin;
  delete headers.referer;
  delete headers['content-length'];
  headers['ngrok-skip-browser-warning'] = 'true';

  const hasBody = !['GET', 'HEAD'].includes(request.method || 'GET');
  const body = hasBody
    ? typeof request.body === 'string'
      ? request.body
      : JSON.stringify(request.body ?? {})
    : undefined;

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    upstream.headers.forEach((value, key) => {
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        response.setHeader(key, value);
      }
    });
    response.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    response.status(502).json({ message: '백엔드 서버에 연결할 수 없습니다.' });
  }
}
