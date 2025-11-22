export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ statusCode:405, message:'Method not allowed' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ statusCode:400, message:'email & password required', data:null });

  const result = {
    statusCode: 200,
    data: {
      tokens: { access: 'mock_access_token_abc123', refresh: 'mock_refresh_token_def456' },
      client: { id: 'user_mock_1', first_name: 'Mock', last_name: 'User', email, app_name: 'MockApp' }
    },
    message: 'Mock login success'
  };
  return res.status(200).json(result);
}
