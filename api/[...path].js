const NOTION_VERSION = '2022-06-28';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const notionUrl = `https://api.notion.com/v1/${Array.isArray(path) ? path.join('/') : path}`;

  try {
    const notionRes = await fetch(notionUrl, {
      method: req.method === 'GET' ? 'POST' : req.method,
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: ['POST','PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });
    const data = await notionRes.json();
    return res.status(notionRes.status).json(data);
  } catch(err) {
    return res.status(500).json({ error: err.message });
  }
}
