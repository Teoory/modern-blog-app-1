const express = require ('express');
const cors = require ('cors');
const mongoose = require ('mongoose');
const User = require ('./models/User');
const MailVerification = require ('./models/MailVerification');
const Post = require ('./models/Post');
const Comment = require ('./models/Comment');
const Notification = require ('./models/Notification');
const Test = require ('./models/Test');
const Ticket = require ('./models/Ticket');
const PrevievPost = require ('./models/PrevievPost');
const Warning = require ('./models/Warning');
const bcrypt = require('bcryptjs');
const app = express ();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const uploadMiddleware = multer({dest: 'uploads/'});
// const uploadProfilePhoto = multer({dest: 'profilephotos/'});
const uploadMiddleware = multer({dest: '/tmp'});
const uploadProfilePhoto = multer({dest: '/tmp'});
const nodemailer = require('nodemailer');
const path = require('path');
const logoPath = path.join(__dirname, 'logo.png');
const fs = require('fs');
require('dotenv').config();

const salt = bcrypt.genSaltSync(10);
const secret = 'secret';

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3030', 'https://fiyasko-blog-api.vercel.app', 'https://fiyaskoblog-frontend.vercel.app'],
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
};

app.use (cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/profilephotos', express.static(__dirname + '/profilephotos'));


mongoose.connect(process.env.MONGODB_URL);
const bucket = 'fiyasko-blog-app';


const transporter = nodemailer.createTransport({
    host: 'ssl://smtp.yandex.com',
    service: 'Yandex',
    port: 465,
    auth: {
        user: `${process.env.MAIL_ADRESS}`, // E-posta adresiniz
        pass: `${process.env.YANDEXSMTP_PASSWORD}` // E-posta şifreniz
    },
});

async function uploadToS3(path, originalname, mimetype, info) {
    const client = new S3Client({
        region: 'eu-central-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
    });
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newFileName = `${Date.now()}_${Math.random().toString(36).substring(6)}.${ext}`;
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: 'uploads/' + newFileName,
        contentType: mimetype,
        ACL: 'public-read',
    }))
    return `https://${bucket}.s3.eu-central-1.amazonaws.com/uploads/${newFileName}`;
}

async function uploadPpToS3(path, originalname, mimetype, info) {
    const client = new S3Client({
        region: 'eu-central-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
    });
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newFileName = `${Date.now()}_${Math.random().toString(36).substring(6)}.${ext}`;
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: 'profilePhotos/' + newFileName,
        contentType: mimetype,
        ACL: 'public-read',
    }))
    return `https://${bucket}.s3.eu-central-1.amazonaws.com/profilePhotos/${newFileName}`;
}

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

app.post('/request-verify-code', async (req, res) => {
    const { email } = req.body;

    try {
      // Mevcut doğrulama kodunu bulma
      let existingVerification = await MailVerification.findOne({ email });
  
      // Eğer varsa, güncelle
      if (existingVerification) {
        // existingVerification.code = Math.random().toString(36).substring(6);
        existingVerification.code = Math.floor(100000 + Math.random() * 900000);
        await existingVerification.save();
      }
      // Yoksa, yeni doğrulama kodu oluştur
      else {
        existingVerification = await MailVerification.create({
          email,
          code: Math.random().toString(36).substring(6),
        });
      }
  
        const mailOptions = {
            from: `${process.env.MAIL_ADRESS}`,
            to: email,
            subject: 'Fiysako Blog | E-posta Doğrulama Kodu',
            // text: `Kaydınızı tamamlamak için aşağıdaki doğrulama kodunu kullanın: ${existingVerification.code}`,
            html: `
                <div style="text-align: center;display: flex;justify-content: center;align-items: center;">
                    <div style="background: #f7f0e4;padding: 20px;border-radius: 25px;width: max-content;">
                        <img src="cid:logo" alt="Logo" style="width: auto; height: 100px;margin-bottom: -15px;">
                        <h1 style="color: #333;padding-bottom: 5px;border-bottom: 1px solid #aaa;">E-posta Doğrulama Kodu</h1>
                        <p style="color: #445;">Merhaba,</p>
                        <p style="color: #445;">Kaydınızı onaylamak için aşağıdaki doğrulama kodunu kullanın:</p>
                        <h2 style="color: #fff;background: #00466a;margin: 10px auto;padding: 10px;border-radius: 4px;width: max-content;letter-spacing: 10px;">${existingVerification.code}</h2>
                        <p style="color: #888;margin-top: -5px;">Doğrulama kodunu kimseyle paylaşmayın.</p>
                        <p style="color: #888;">Eğer bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın.</p>
                        <hr style="border:none;border-top:1px solid #cdcdcd" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>Fiyasko Blog</p>
                        </div>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: 'logo.png',
                    path: logoPath,
                    cid: 'logo'
                }
            ]
        };

        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log('E-posta gönderme hatası:', error);
            res.status(500).json({ error: 'E-posta gönderme hatası.' });
          } else {
            console.log('E-posta gönderildi:', info.response);
            res.status(200).json({ message: 'Doğrulama kodu başarıyla gönderildi.' });
          }
        });
      } catch (error) {
        console.error('Doğrulama kodu oluşturma hatası:', error);
        res.status(500).json({ error: 'Doğrulama kodu oluşturma hatası.' });
      }
});

app.post('/verify-email', async (req, res) => {
    const { verificationCode } = req.body;
    try {
      const verification = await MailVerification.findOne({ code: verificationCode });
  
      if (!verification) {
        return res.status(404).json({ error: 'Geçersiz doğrulama kodu.' });
      }
      
      await User.findOneAndUpdate({ email: verification.email }, { isVerified: true });
  
      await MailVerification.deleteOne({ _id: verification._id });
  
      res.status(200).json({ message: 'E-posta adresi başarıyla doğrulandı.' });
    } catch (error) {
      console.error('Doğrulama hatası:', error);
      res.status(500).json({ error: 'Doğrulama hatası.' });
    }
});


app.post ('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    if (!userDoc) {
        return res.redirect('/login');
    }
    const  passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        jwt.sign({username, profilePhoto:userDoc.profilePhoto , email:userDoc.email, tags:userDoc.tags, id:userDoc._id, likedPosts:userDoc.likedPosts}, secret, {} , (err, token) => {
            if (err) {
                console.error('Token oluşturulamadı:', err);
                return res.status(500).json({ error: 'Token oluşturulamadı' });
            }

            res.cookie('token', token,{maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: false}).json({
                id:userDoc._id,
                username,
                email:userDoc.email,
                tags:userDoc.tags,
                profilePhoto: userDoc.profilePhoto,
                likedPosts: userDoc.likedPosts,
            });
            console.log('Logged in, Token olusturuldu.', token);
        });
    }else{
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

app.get('/profile/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
  
      res.json({ user, posts });
    } catch (error) {
      console.error('Error getting user profile:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/profile/:username/likedPosts', async (req, res) => {
    const { username } = req.params;
  
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        const likedPosts = await Post.find({ '_id': { $in: user.likedPosts } }).populate('author', ['username']).sort({ updatedAt: -1 });
  
        res.json({ likedPosts });
    } catch (error) {
        console.error('Error getting liked posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//? Notifications
app.post('/notifications', async (req, res) => {
    try {
        const { sender, receiver, post, type } = req.body;
        const notification = await Notification.create({ sender, receiver, post, type });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Bildirim oluşturulurken bir hata oluştu.' });
    }
});

app.get('/notifications/:userId', async (req, res) => {
    const profilID = req.params.userId;
    try {
        const userId = req.params.userId;
        const notifications = await Notification.find({ receiver: userId }).populate('sender').populate('post').sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Bildirimleri getirirken bir hata oluştu.' });
    }
});

app.post('/send-notification', async (req, res) => {
    const { senderId, receiverId, postId, type } = req.body;

    const notification = new Notification({
        sender: senderId,
        receiver: receiverId,
        post: postId,
        type: type
    });
    await notification.save();

    res.status(200).json({ message: 'Bildirim gönderildi.' });
});

app.post('/mark-all-notifications-as-read', async (req, res) => {
    try {
        const { userId } = req.body;
        await Notification.updateMany({ receiver: userId }, { isRead: true });
        res.status(200).json({ message: 'Tüm bildirimler başarıyla okundu olarak işaretlendi.' });
    } catch (error) {
        res.status(500).json({ error: 'Bir hata oluştu, bildirimler işaretlenemedi.' });
    }
});

app.get('/check-new-notifications', async (req, res) => {
    try {
        const { userId } = req.query;
        const notifications = await Notification.find({ receiver: userId });
        const newNotificationExists = notifications.some(notification => !notification.isRead);
        res.status(200).json({ newNotificationExists });
    } catch (error) {
        res.status(500).json({ error: 'Bir hata oluştu, yeni bildirimler kontrol edilemedi.' });
    }
});

//? Logout
app.post('/logout', (req, res) => {
    res.clearCookie('token').json('ok');
});

//? Profile Photo
app.post('/profilePhoto', uploadProfilePhoto.single('file'), async (req, res) => {
    const pp = [];
    const {originalname,path,mimetype} = req.file;
    // const parts= originalname.split('.');
    // const ext = parts[parts.length - 1];
    // const newPath = path + '.' + ext;
    // fs.renameSync(path, newPath);
    const url = await uploadPpToS3(path, originalname, mimetype);
    pp.push(url);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const userDoc = await User.findById(info.id);
        // const newFileName = `${userDoc.username}_profilePhoto.${ext}`;
        // const newPath = path + newFileName;

        // fs.renameSync(path, newPath);
        userDoc.profilePhoto = url;
        await userDoc.save();
        res.json(userDoc);
    });
});

app.put('/profilePhoto', uploadProfilePhoto.single('file'), async (req, res) => {
    const pp = [];
    let newPath = null; 
    if(req.file) {
        const {originalname,path,mimetype} = req.file;
        // const parts= originalname.split('.');
        // const ext = parts[parts.length - 1];
        // newPath = path + '.' + ext;
        // fs.renameSync(path, newPath);
        const url = await uploadPpToS3(path, originalname, mimetype);
        pp.push(url);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const userDoc = await User.findById(info.id);
        // const newFileName = `${userDoc.username}_profilePhoto.${ext}`;
        // const newPath = path + newFileName;

        fs.renameSync(path, newPath);
        userDoc.profilePhoto = url;
        
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

//? DarkMode
app.put('/darkmode', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const userDoc = await User.findById(info.id);
        userDoc.darkMode = !userDoc.darkMode;
        await userDoc.save();
        res.json(userDoc.darkMode);
    });
});

app.get('/darkmode', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const userDoc = await User.findById(info.id);
        res.json(userDoc.darkMode);
    });
});

//? Post
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const cover = [];
    const {originalname,path,mimetype} = req.file;
    // const parts= originalname.split('.');
    // const ext = parts[parts.length - 1];
    // const newPath = path + '.' + ext;
    // fs.renameSync(path, newPath);
    const url = await uploadToS3(path, originalname, mimetype);
    cover.push(url);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const {id, title, summary, content, previev, PostTags} = req.body;
            const postDoc = await Post.create({
                title,
                summary,
                content,
                // cover: newPath,
                cover: url,
                author: info.id,
                previev,
                PostTags,
            });
            res.json({postDoc});
        });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    const cover = [];
    let newPath = null; 
    if(req.file) {
        const {originalname,path,mimetype} = req.file;
        // const parts= originalname.split('.');
        // const ext = parts[parts.length - 1];
        // newPath = path + '.' + ext;
        // fs.renameSync(path, newPath);
        const url = await uploadToS3(path, originalname, mimetype);
        cover.push(url);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, summary, content, previev, PostTags} = req.body;
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
            // cover: newPath?newPath:postDoc.cover,
            cover: url?url:postDoc.cover,
            previev,
            PostTags,
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
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate('author', ['username']);
        
        if (!postDoc) {
            return res.redirect('/');
        }

        res.json(postDoc);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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

//? Post Tags
app.get('/availableTags', async (req, res) => {
    const enumValues = Post.schema.path('PostTags').enumValues;
    res.json({availableTags: enumValues});
})

app.get('/posts/:tag', async (req, res) => {
    const { tag } = req.params;

    try {
        const posts = await Post.find({ PostTags: tag }).populate('author', ['username']);
        res.json({ posts });
    } catch (error) {
        console.error('Error getting posts by tag:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//* Ticket
app.post('/ticket', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, content, status} = req.body;
            const ticketDoc = await Ticket.create({
                title,
                content,
                author: info.id,
                status,
            });
            res.json({ticketDoc});
        });
});

app.put('/ticket', async (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, content, status} = req.body;
        const ticketDoc = await Ticket.findById(id);
        
        const isAuthor = JSON.stringify(ticketDoc.author) === JSON.stringify(info.id);

        const isAdmin = info.tags.includes('admin');
        const isModerator = info.tags.includes('moderator');

        if(!isAuthor && !isAdmin && !isModerator) {
            return res.status(400).json('You don\'t have permission.');
        }

        await Ticket.findByIdAndUpdate(id, {
            title, 
            content, 
            author: info.id,
            status,
        });

        res.json(ticketDoc);
    });
});

app.get('/ticket', async (req, res) => {
    res.json(
        await Ticket.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
});

app.get('/ticket/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ticketDoc = await Ticket.findById(id).populate('author', ['username']);

        if (!ticketDoc) {
            return res.redirect('/');
        }

        res.json(ticketDoc);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/ticket/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const ticketDoc = await Ticket.findById(id);

        const isAuthor = JSON.stringify(ticketDoc.author) === JSON.stringify(info.id);

        const isAdmin = info.tags.includes('admin');
        const isModerator = info.tags.includes('moderator');

        if(!isAuthor && !isAdmin && !isModerator) {
            return res.status(400).json('Don\'t have permission!');
        }
        await Ticket.findByIdAndDelete(id);
        res.json({ message: 'Ticket deleted successfully' });
    });
});

//* Like
app.post('/post/:id/like', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
  
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
  
      try {
        const postDoc = await Post.findById(id);
  
        const hasLiked = postDoc.likes.includes(info.id);
        if (hasLiked) {
            postDoc.likes.pull(info.id);
            
            const user = await User.findOne({ _id: info.id });
            user.likedPosts.pull(postDoc._id);
            await user.save();
        } else {
            postDoc.likes.push(info.id);

            const user = await User.findOne({ _id: info.id });
            if(!user.likedPosts.includes(postDoc._id)) {
                user.likedPosts.push(postDoc._id);
                await user.save();
            }
        }
  
        await postDoc.save();
  
        res.json({ success: true, likes: postDoc.likes.length, isLiked: !hasLiked });
      } catch (error) {
        console.error('Error toggling like:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
});
  

app.get('/post/:id/likes', async (req, res) => {
  const { id } = req.params;

  try {
    const postDoc = await Post.findById(id);
    res.json({ likes: postDoc.likes.length });
  } catch (error) {
    console.error('Error getting likes:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  

app.get('/post/:id/hasLiked', async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    
    if (!token) {
        return res.status(404).json({ error: 'Token not found' });
    }
    if (err) throw err;

    try {
      const postDoc = await Post.findById(id);
      const hasLiked = postDoc.likes.includes(info.id);
      res.json({ hasLiked });
    } catch (error) {
      console.error('Error checking if user has liked:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

//* SuperLike
app.post('/post/:id/superlike', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
  
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
  
      try {
        const postDoc = await Post.findById(id);
        const hasSuperLiked = postDoc.superlikes.includes(info.id);
        if (hasSuperLiked) {
          postDoc.superlikes.pull(info.id);
        } else {
          postDoc.superlikes.push(info.id);
        }
  
        await postDoc.save();
  
        res.json({ success: true, superlikes: postDoc.superlikes.length, isSuperLiked: !hasSuperLiked });
      } catch (error) {
        console.error('Error toggling like:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
});

app.get('/post/:id/superlikes', async (req, res) => {
  const { id } = req.params;

  try {
    const postDoc = await Post.findById(id);
    res.json({ superlikes: postDoc.superlikes.length });
  } catch (error) {
    console.error('Error getting superlike:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  

app.get('/post/:id/hasSuperLiked', async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    
    if (!token) {
        return res.status(404).json({ error: 'Token not found' });
    }
    if (err) throw err;

    try {
      const postDoc = await Post.findById(id);
      const hasSuperLiked = postDoc.superlikes.includes(info.id);
      res.json({ hasSuperLiked });
    } catch (error) {
      console.error('Error checking if user has superliked:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});


//? Previev Post
app.post('/previevPost', uploadMiddleware.single('file'), async (req, res) => {
    const cover = [];
    const {originalname,path,mimetype} = req.file;
    // const parts= originalname.split('.');
    // const ext = parts[parts.length - 1];
    // const newPath = path + '.' + ext;
    // fs.renameSync(path, newPath);
    const url = await uploadToS3(path, originalname, mimetype);
    cover.push(url);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const {id, title, summary, content, previev, PostTags} = req.body;
            const postDoc = await PrevievPost.create({
                title,
                summary,
                content,
                // cover: newPath,
                cover: url,
                author: info.id,
                previev,
                PostTags,
            });
            res.json({postDoc});
        });
});

app.put('/previevPost', uploadMiddleware.single('file'), async (req, res) => {
    const cover = [];
    let newPath = null; 
    if(req.file) {
        const {originalname,path,mimetype} = req.file;
        // const parts= originalname.split('.');
        // const ext = parts[parts.length - 1];
        // newPath = path + '.' + ext;
        // fs.renameSync(path, newPath);
        const url = await uploadToS3(path, originalname, mimetype);
        cover.push(url);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, summary, content, previev, PostTags} = req.body;
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
            // cover: newPath?newPath:postDoc.cover,
            cover: url?url:postDoc.cover,
            previev,
            PostTags,
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
        const postDoc = await PrevievPost.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        const isAdmin = info.tags.includes('admin');
        const isModerator = info.tags.includes('moderator');
        if(!isAuthor && !isAdmin && !isModerator) {
            return res.status(400).json('Don\'t have permission!');
        }
        await PrevievPost.findByIdAndDelete(id);
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



//? Tests 
app.post('/test', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname,path} = req.file;
    const parts= originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const {id, title, summary, content, previev} = req.body;
            const testDoc = await Test.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
                previev,
            });
            res.json({testDoc});
        });
});

app.put('/test', uploadMiddleware.single('file'), async (req, res) => {
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
        const testDoc = await Test.findById(id);
        const isAuthor = JSON.stringify(testDoc.author) === JSON.stringify(info.id);
        const isAdmin = info.tags.includes('admin');
        const isModerator = info.tags.includes('moderator');
        const isEditor = info.tags.includes('editor');
        if(!isAuthor && !isAdmin && !isModerator && !isEditor) {
            return res.status(400).json('You don\'t have permission.');
        }

        await Test.findByIdAndUpdate(id, {
            title, 
            summary, 
            content, 
            cover: newPath?newPath:testDoc.cover,
            previev,
        });

        res.json(testDoc);
    });
});

app.get('/test/:id', async (req, res) => {
    const {id} = req.params;
    const testDoc = await Test.findById(id).populate('author', ['username'])
    res.json(testDoc);
});

app.delete('/test/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const testDoc = await Test.findById(id);
        const isAuthor = JSON.stringify(testDoc.author) === JSON.stringify(info.id);
        const isAdmin = info.tags.includes('admin');
        const isModerator = info.tags.includes('moderator');
        if(!isAuthor && !isAdmin && !isModerator) {
            return res.status(400).json('Your not ADMIN!');
        }
        await Test.findByIdAndDelete(id);
        res.json({ message: 'Test deleted successfully' });
    });
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

app.post('/post/:id/comment', uploadProfilePhoto.single('file'), async (req, res) => {
    const {id} = req.params;
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {content} = req.body;

        try {
            const commentDoc = await Comment.create({
                content,
                author: info.id,
                post: id,
            });

            res.json(commentDoc);
        } catch (e) {
            console.error('Error with add comment',e);
            res.status(500).json({e:'server error'});
        }
    });
});

app.get('/post/:id/comments', async (req, res) => {
    const {id} = req.params;
    try {
        const comments = await Comment.find({post: id})
        .populate('author', ['username', 'profilePhoto'])
        .sort({createdAt: -1})
        .limit(20);

        res.json(comments);
    } catch (e) {
        console.error('Error with get comments',e);
        res.status(500).json({e:'server error'});
    }
});


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

