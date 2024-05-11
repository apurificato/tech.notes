const router = require('express').Router();
const { Blog } = require('../models');

async function handleError(err, res) {
    console.log(err);
    return res.redirect('/');
}

// // Create a new blog post
// router.post('/api/blogs', async (req, res) => {
//     try {
//         const { title, content, userId } = req.body;
//         const blog = await Blog.create({ title, content, userId });
//         return res.json(blog);
//     } catch (err) {
//         handleError(err, res);
//     }
// });

// POST route for creating a new blog post
router.post('/', async (req, res) => {
    try {
        // Retrieve data from request body
        const { title, content, userId } = req.body;
        // Create new blog post
        const blog = await Blog.create({ title, content, userId });
        // Send JSON response with the created blog post
        res.status(201).json(blog);
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get all blog posts and render them on home page
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.findAll({ include: User });
        // Render home page with blog posts using Handlebars template
        res.render('home', { blogs });
    } catch (err) {
        handleError(err, res);
    }
});


// Get blog post by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByPk(id, { include: User });
        return res.json(blog);
    } catch (err) {
        handleError(err, res);
    }
});

// Update a blog post
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        blog.title = title;
        blog.content = content;
        await blog.save();
        return res.json(blog);
    } catch (err) {
        handleError(err, res);
    }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        await blog.destroy();
        return res.json({ message: 'Blog post deleted successfully' });
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = router;
