const prisma = require('../prismaClient');

async function getMyMessages(req, res) {
  try {
    const userId = req.user.id;
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { recipientId: userId }] },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { sender: { select: { id: true, name: true } }, recipient: { select: { id: true, name: true } } }
    });
    res.json({ messages });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function sendMessage(req, res) {
  try {
    const senderId = req.user.id;
    const { recipientId, content } = req.body;
    if (!recipientId || !content) return res.status(400).json({ error: 'Missing fields' });
    const msg = await prisma.message.create({ data: { senderId, recipientId, content } });
    res.status(201).json({ message: msg });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getMyMessages, sendMessage };