export default function handler(req, res) {
    if (req.method === 'POST') {
      const { name } = req.body;
      res.json({ message: "Hello " + name });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  }