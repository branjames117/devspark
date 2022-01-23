const router = require('express').Router();
const { User, Skill } = require('../../models');

// GET /api/skills
router.get('/', async (req, res) => {
  const skills = await Skill.findAll({
    attributes: ['id', 'skill_name'],
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
      },
    ],
  });

  if (skills.length === 0)
    return res.status(500).json({ message: 'No skills found' });

  res.json(skills);
});

// GET /api/skills/1
router.get('/:id', async (req, res) => {
  const skill = await Skill.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'skill_name'],
  });

  if (!skill) {
    res.status(404).json({ message: 'No skill found with this id' });
    return;
  }

  res.json(skill);
});

module.exports = router;
