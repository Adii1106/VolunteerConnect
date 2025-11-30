const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');

async function listPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        author: { select: { id: true, name: true, role: true } },
        comments: { include: { author: { select: { id: true, name: true, role: true } } }, orderBy: { createdAt: 'desc' }, take: 5 },
        _count: { select: { comments: true, reactions: true } }
      }
    });
    res.json({ posts });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function createPost(req, res) {
  try {
    const authorId = req.user.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Missing content' });
    const post = await prisma.post.create({ data: { authorId, content } });
    res.status(201).json({ post });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function addComment(req, res) {
  try {
    const authorId = req.user.id;
    const postId = Number(req.params.id);
    const { content } = req.body;
    if (!postId || !content) return res.status(400).json({ error: 'Missing fields' });
    const comment = await prisma.comment.create({ data: { postId, authorId, content } });
    res.status(201).json({ comment });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function toggleLike(req, res) {
  try {
    const userId = req.user.id;
    const postId = Number(req.params.id);
    if (!postId) return res.status(400).json({ error: 'Missing post id' });
    const existing = await prisma.reaction.findFirst({ where: { postId, userId, type: 'LIKE' } });
    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      return res.json({ liked: false });
    } else {
      await prisma.reaction.create({ data: { postId, userId, type: 'LIKE' } });
      return res.json({ liked: true });
    }
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { listPosts, createPost, addComment, toggleLike };
