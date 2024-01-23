const express = require ('express');
const cors = require ('cors');
const mongoose = require ('mongoose');
const User = require ('./models/User');
const Post = require ('./models/Post');
const PrevievPost = require ('./models/PrevievPost');
const Warning = require ('./models/Warning');
const bcrypt = require('bcryptjs');
const app = express ();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const uploadProfilePhoto = multer({dest: 'profilephotos/'});
const fs = require('fs');
require('dotenv').config();

const salt = bcrypt.genSaltSync(10);
const secret = 'secret';

app.use (cors ({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/profilephotos', express.static(__dirname + '/profilephotos'));

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.hd2atfr.mongodb.net/?retryWrites=true&w=majority`);

//? Register & Login
app.post ('/register', async (req, res) => {
    const {username, password, email} = req.body;
    try {
        const userDoc = await User.create({
            username,
            email,
            password:bcrypt.hashSync(password, salt),
            tags: ['user'],
        })
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post ('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const  passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        //login
        jwt.sign({username, email:userDoc.email, tags:userDoc.tags, id:userDoc._id}, secret, {} , (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
                email:userDoc.email,
                tags:userDoc.tags,
            });
        });
    }else{
        //error
        res.status(400).json({message: 'Wrong password'});
    }
});

//? Profile
app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    });
});

//? Logout
app.post('/logout', (req, res) => {
    res.clearCookie('token').json('ok');
});

//? Profile Photo
app.post('/profilePhoto', uploadProfilePhoto.single('file'), async (req, res) => {
    const {originalname,path} = req.file;
    const parts= originalname.split('.');
    const ext = parts[parts.length - 1];
    // const newPath = path + '.' + ext;
    // fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const userDoc = await User.findById(info.id);
        const newFileName = `${userDoc.username}_profilePhoto.${ext}`;
        const newPath = path + newFileName;

        fs.renameSync(path, newPath);
        userDoc.profilePhoto = newPath;
        await userDoc.save();
        res.json(userDoc);
    });
});

app.put('/profilePhoto', uploadProfilePhoto.single('file'), async (req, res) => {
    let newPath = null; 
    if(req.file) {
        const {originalname,path} = req.file;
        const parts= originalname.split('.');
        const ext = parts[parts.length - 1];
        // newPath = path + '.' + ext;
        // fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const userDoc = await User.findById(info.id);
        const newFileName = `${userDoc.username}_profilePhoto.${ext}`;
        const newPath = path + newFileName;

        fs.renameSync(path, newPath);
        userDoc.profilePhoto = newPath;
        
        // userDoc.profilePhoto = newPath?newPath:userDoc.profilePhoto;
        await userDoc.save();
        res.json(userDoc);
    });
});

app.get('/profilephoto', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const userDoc = await User.findById(info.id);
        res.json(userDoc.profilePhoto);
    });
});

//? Post
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname,path} = req.file;
    const parts= originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const {id, title, summary, content, previev} = req.body;
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
                previev,
            });
            res.json({postDoc});
        });
}); 

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null; 
    if(req.file) {
        const {originalname,path} = req.file;
        const parts= originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, summary, content, previev} = req.body;
        const postDoc = await Post.findById(id);

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        
        const isAdmin = info.tags.includes('admin');
        const isModerator = info.tags.includes('moderator');
        const isEditor = info.tags.includes('editor');
        if(!isAuthor && !isAdmin && !isModerator && !isEditor) {
            return res.status(400).json('You don\'t have permission.');
        }

        await Post.findByIdAndUpdate(id, {
            title, 
            summary, 
            content, 
            cover: newPath?newPath:postDoc.cover,
            previev,
        });

        res.json(postDoc);
    });
});

app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        const isAdmin = info.tags.includes('admin');
        const isModerator = info.tags.includes('moderator');
        if(!isAuthor && !isAdmin && !isModerator) {
            return res.status(400).json('Don\'t have permission!');
        }
        await Post.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    });
});

//? Previev Post
app.post('/previevPost', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname,path} = req.file;
    const parts= originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const {id, title, summary, content, previev} = req.body;
            const postDoc = await PrevievPost.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
                previev,
            });
            res.json({postDoc});
        });
});

app.put('/previevPost', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null; 
    if(req.file) {
        const {originalname,path} = req.file;
        const parts= originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, summary, content, previev} = req.body;
        const postDoc = await PrevievPost.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        const isAdmin = info.tags.includes('admin');
        const isModerator = info.tags.includes('moderator');
        const isEditor = info.tags.includes('editor');
        if(!isAuthor && isAdmin && isModerator && isEditor) {
            return res.status(400).json('You don\'t have permission.');
        }

        await PrevievPost.findByIdAndUpdate(id, {
            title, 
            summary, 
            content, 
            cover: newPath?newPath:postDoc.cover,
            previev,
        });

        res.json(postDoc);
    });
});

app.get('/previevPost', async (req, res) => {
    res.json(
        await PrevievPost.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

app.get('/previevPost/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await PrevievPost.findById(id).populate('author', ['username'])
    res.json(postDoc);
});

app.delete('/previevPost/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        const isAdmin = info.tags.includes('admin');
        const isModerator = info.tags.includes('moderator');
        if(!isAuthor && !isAdmin && !isModerator) {
            return res.status(400).json('Your not ADMIN!');
        }
        await Post.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    });
});

//? Approve Post
app.get('/approvePost', async (req, res) => {
    res.json(
        await PrevievPost.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

app.get('/approvePost/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await PrevievPost.findById(id).populate('author', ['username'])
    res.json(postDoc);
});

app.put('/approvePost/:id', async (req, res) => {
    const {id} = req.params;
    const {token} = req.cookies;

    try {
        if(!token) {
            return res.status(401).json({message: 'No token provided'});
        }

        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) throw err;

            const postDoc = await PrevievPost.findById(id);
            if(!PrevievPost) {
                return res.status(404).json({message: 'Post not found'});
            }

            const isAdmin = info.tags.includes('admin');
            const isModerator = info.tags.includes('moderator');
            const isEditor = info.tags.includes('editor');
            if(!isAdmin && !isModerator && !isEditor) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const newPost = await Post.create({
                title: postDoc.title,
                summary: postDoc.summary,
                content: postDoc.content,
                cover: postDoc.cover,
                author: postDoc.author,
                previev: postDoc.previev,
            });

            await newPost.save();
            await PrevievPost.deleteOne({ _id: id });

            res.json({message: 'Post approved successfully'});
        });        
    } catch (e) {
        res.status(500).json(e);
    }
});

//? Search
app.get('/search/:keyword', async (req, res) => {
    const {keyword} = req.params;
    const postDoc = await Post.find({title: {$regex: keyword, $options: 'i'}})
    res.json(postDoc);
});

//? Tags
app.get('/tags', async (req, res) => {
    res.json(
        await User.find({},'tags')
    );
});

app.get('/tags/:tag', async (req, res) => {
    const {tag} = req.params;
    res.json(
        await User.find({tags: tag},'username email tags')
    );
});

//? Comments
app.post('/post/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const postDoc = await Post.findById(id);
        const newComment = await postDoc.comments.create({
            content: comment,
            author: info.id,
        });
        await postDoc.comments.push(newComment);
        await postDoc.save();
        res.json(newComment);
    }
    );
});

app.put('/post/:id/upvote', async (req, res) => {
    const   { name }  = req.params;
    
    await db.collection('blogs').updateOne({ name }, {
        $inc: { upvotes: 1 },
    });
    const blog = await db.collection('blogs').findOne({ name });

    if( blog ) {
        res.json(blog);
    } else {
        res.send('That blog doesn\'t exist!');
    }
});

// app.post('/post/:id/comments',  async (req, res) => {
//     const { name } = req.params;
//     const { postedBy, text } = req.body;

//     await db .collection('blogs').updateOne({ name }, {
//         $push: { comments: { postedBy, text} },
//     });
//     const blog = await db.collection('blogs').findOne({ name });

//     if (blog) {
//         res.json(blog);
//     } else {
//         res.send('That blog doesn\'t exist!');
//     }
// })





//!Admin
const isAdmin = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Kullanıcı etiketlerini kontrol et
        if (info.tags.includes('admin')) {
            next(); // Yetkilendirme başarılı
        } else {
            res.status(403).json({ error: 'Forbidden' });
        }
    });
};


app.get('/users', isAdmin, async (req, res) => {
    res.json(
        await User.find({},'username email tags')
        .sort({createdAt: -1})
    );
});

app.post('/changeTag', async (req, res) => {
    const {username, newTag} = req.body;
    const userDoc = await User.findOne({username});
    userDoc.tags = [newTag];
    await userDoc.save();
    res.json(userDoc);
});


//? Alert Message
app.put('/warning', async (req, res) => {
    const {title, message} = req.body;

    try {
        const existWarning = await Warning.findOne({});
        if(existWarning){
            existWarning.title = title;
            existWarning.message = message;
            await existWarning.save();
            res.json({warningDoc: existWarning});
        } else {
            const newWarning = await Warning.create({
                title,
                message,
            });
            res.json({warningDoc: newWarning});
        }
    } catch (e) {
        res.status(400).json(e);
    }
});

app.get('/getWarning', async (req, res) => {
    res.json(
        await Warning.findOne({},'title message')
    );
});


app.listen(3030, () => {
    console.log('Server listening on port 3030 || nodemon index.js')
});

