export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ statusCode:405, message:'Method not allowed' });
  const apps = [
    { id: 'app_1', app_name: 'Payments', descripition: 'Payment gateway' },
    { id: 'app_2', app_name: 'Analytics', descripition: 'Analytics dashboard' },
    { id: 'app_3', app_name: 'Chat', descripition: 'In-app chat' }
  ];
  return res.status(200).json({ statusCode:200, data: apps, message: 'Mock apps' });
}
