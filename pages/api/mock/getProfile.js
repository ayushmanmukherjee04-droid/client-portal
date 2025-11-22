export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ statusCode:405, message:'Method not allowed' });
  const profile = { id:'user_mock_1', first_name:'Mock', last_name:'User', email:'mock.user@example.com', app_name:'MockApp' };
  return res.status(200).json({ statusCode:200, data: profile, message: 'Mock profile' });
}
