const prisma = require('../prismaClient');

async function searchUsers(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ users: [] });
    const users = await prisma.user.findMany({
      where: { OR: [
        { name: { contains: q } },
        { email: { contains: q } }
      ] },
      select: { id: true, name: true, email: true, role: true },
      take: 10
    });
    res.json({ users });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { searchUsers };
