export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ statusCode:405, message:'Method not allowed' });
  const { app_id } = req.body || {};
  if (!app_id) return res.status(400).json({ statusCode:400, message:'app_id required' });

  return res.status(200).json({
    statusCode:200,
    data: { url: `https://mock.${app_id}.example.com/connect?user=mock`, token: `mock_token_${app_id}_xyz` },
    message: 'Mocked URL & token'
  });
}
