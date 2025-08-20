export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Pages Router API works!',
    timestamp: new Date().toISOString()
  });
}