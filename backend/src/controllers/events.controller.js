const prisma = require('../prismaClient');

async function listEvents(req, res) {
  try {
    const { q, category, status, from, to } = req.query;
    const where = { AND: [] };
    if (q) where.AND.push({ OR: [
      { title: { contains: q } },
      { description: { contains: q } },
      { locationText: { contains: q } }
    ] });
    if (category) where.AND.push({ category });
    if (status) where.AND.push({ status });
    if (from) where.AND.push({ date: { gte: new Date(from) } });
    if (to) where.AND.push({ date: { lte: new Date(to) } });
    const events = await prisma.event.findMany({ where, orderBy: { date: 'asc' }, take: 50 });
    res.json({ events });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function applyToEvent(req, res) {
  try {
    const userId = req.user.id;
    const eventId = Number(req.params.id);
    if (!eventId) return res.status(400).json({ error: 'Invalid event id' });
    const existing = await prisma.eventSignup.findFirst({ where: { eventId, volunteerId: userId } });
    if (existing) return res.status(409).json({ error: 'Already registered' });
    const signup = await prisma.eventSignup.create({ data: { eventId, volunteerId: userId } });
    await prisma.event.update({ where: { id: eventId }, data: { currentVolCount: { increment: 1 } } });
    res.status(201).json({ signup });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { listEvents, applyToEvent };
async function createEvent(req, res) {
  try {
    if (req.user.role !== 'ORGANISER') return res.status(403).json({ error: 'Forbidden' });
    const { title, description, category = 'General', date, locationText, maxVolunteers = 10 } = req.body;
    if (!title || !description || !date || !locationText) return res.status(400).json({ error: 'Missing fields' });
    const ev = await prisma.event.create({ data: {
      title, description, category, date: new Date(date), locationText, maxVolunteers,
      postedById: req.user.id
    } });
    res.status(201).json({ event: ev });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports.createEvent = createEvent;

async function listMyEvents(req, res) {
  try {
    if (req.user.role !== 'ORGANISER') return res.status(403).json({ error: 'Forbidden' });
    const events = await prisma.event.findMany({ where: { postedById: req.user.id }, orderBy: { createdAt: 'desc' } });
    res.json({ events });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function getEventSignups(req, res) {
  try {
    if (req.user.role !== 'ORGANISER') return res.status(403).json({ error: 'Forbidden' });
    const eventId = Number(req.params.id);
    const signups = await prisma.eventSignup.findMany({
      where: { eventId },
      include: { volunteer: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ signups });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports.listMyEvents = listMyEvents;
module.exports.getEventSignups = getEventSignups;
