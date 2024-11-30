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
const Iyzipay = require('iyzipay');
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
const sharp = require('sharp');
const session = require('express-session');
const { count } = require('console');
require('dotenv').config();

const salt = bcrypt.genSaltSync(10);
const secret = '582905839824723984723749872938479823798huhsıufhsdfuhsdıu8789a67868768678a6s7d87a9';

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3030', 'https://fiyasko-blog-api.vercel.app', 'https://fiyaskoblog-frontend.vercel.app', 'https://fiyasko.online', 'https://kofu.com.tr'],
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
};

app.use (cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/profilephotos', express.static(__dirname + '/profilephotos'));

app.use(session({
    secret: '582905839824723984723749872938479823798huhsıufhsdfuhsdıu8789a67868768678a6s7d87a9',
    resave: false,
    saveUninitialized: true
}));

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: 'https://sandbox-api.iyzipay.com'
});


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
    const buffer = await sharp(fs.readFileSync(path))
        .resize({ width: 800 })
        .jpeg({ quality: 50 })
        .toBuffer();
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: buffer,
        Key: 'uploads/' + newFileName,
        contentType: mimetype,
        ACL: 'public-read',
    }))
    return `https://${bucket}.s3.eu-central-1.amazonaws.com/uploads/${newFileName}`;
}

async function uploadToS3Quests(path, originalname, mimetype, info) {
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
    const buffer = await sharp(fs.readFileSync(path))
        .resize({ width: 800 })
        .jpeg({ quality: 50 })
        .toBuffer();
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: buffer,
        Key: 'quests/' + newFileName,
        contentType: mimetype,
        ACL: 'public-read',
    }))
    return `https://${bucket}.s3.eu-central-1.amazonaws.com/quests/${newFileName}`;
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
    const buffer = await sharp(fs.readFileSync(path))
        .resize({ width: 800 })
        .jpeg({ quality: 50 })
        .toBuffer();
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: buffer,
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
            bio: '',
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
            subject: 'Kofu Blog | E-posta Doğrulama Kodu',
            // text: `Kaydınızı tamamlamak için aşağıdaki doğrulama kodunu kullanın: ${existingVerification.code}`,
            html: `
                <div style="text-align: center;display: flex;justify-content: center;">
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
                            <p>Kofu Blog</p>
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

        await User.findOneAndUpdate({ email: verification.email }, { isVerified: true, tags: ['writer'] });

        
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
        jwt.sign({username, profilePhoto:userDoc.profilePhoto , email:userDoc.email, tags:userDoc.tags, id:userDoc._id, likedPosts:userDoc.likedPosts}, secret, { expiresIn: '24h' } , (err, token) => {
            if (err) {
                console.error('Token oluşturulamadı:', err);
                return res.status(500).json({ error: 'Token oluşturulamadı' });
            }

            res.cookie('token', token,{sameSite: "none", maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true}).json({
                id:userDoc._id,
                username,
                email:userDoc.email,
                bio:userDoc.bio,
                tags:userDoc.tags,
                isVerified:userDoc.isVerified,
                isBanned:userDoc.isBanned,
                premiumExpiration:userDoc.premiumExpiration,
                userColor:userDoc.userColor,
                profilePhoto: userDoc.profilePhoto,
                likedPosts: userDoc.likedPosts,
                likedTests: userDoc.likedTests,
                token,
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
        if(userDoc?.isBanned) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
            });
            return res.status(400).json('You are banned!');
        }
        res.json(info);
    });
});

app.get('/mobileProfile', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
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

app.get('/notifications/:userId/:id', async (req, res) => {
    try {
        const { userId, id } = req.params;
        const notification = await Notification.findById(id).populate('sender').populate('post');
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Bildirim getirilirken bir hata oluştu.' });
    }
});

app.delete('/notifications/:userId/:id', async (req, res) => {
    try {
        const { userId, id } = req.params;
        await Notification.findByIdAndDelete(id);
        res.json({ message: 'Bildirim başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Bildirim silinirken bir hata oluştu.' });
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
    const { senderId, receiverId, postId, testId, type } = req.body;

    const notification = new Notification({
        sender: senderId,
        receiver: receiverId,
        post: !postId ? null : postId,
        test: !testId ? null : testId,
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
// app.post('/logout', (req, res) => {
//     req.session?.destroy();
//     res.clearCookie('token', '', {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//         path: '/',
//     });

//     res.status(200).json({ message: 'Logged out from all devices' });
// });

app.post('/logout', (req, res) => {
    req.session?.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Session destruction failed' });
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        });
        return res.status(200).json({ message: 'Logged out from all devices' });
    });
});

//? User Bio
app.post('/userBio/:username', async (req, res) => {
    const { username } = req.params;
    const { bio } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }
        user.bio = bio;
        await user.save();
        res.json({ bio: user.bio });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu, kullanıcı biyografisi güncellenemedi.' });
    }
});
  
app.get('/userBio/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }
        res.json({ bio: user.bio });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu, kullanıcı biyografisi getirilemedi.' });
    }
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

app.post('/mobileProfilePhoto', uploadProfilePhoto.single('file'), async (req, res) => {
    const pp = [];
    const {originalname,path,mimetype} = req.file;
    const url = await uploadPpToS3(path, originalname, mimetype);
    pp.push(url);

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const userDoc = await User.findById(info.id);
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

app.put('/mobileDarkmode', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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

app.get('/mobileDarkmode', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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
    const url = null;
    if(req.file) {
        const {originalname,path,mimetype} = req.file;
        // const parts= originalname.split('.');
        // const ext = parts[parts.length - 1];
        // newPath = path + '.' + ext;
        // fs.renameSync(path, newPath);
        url = await uploadToS3(path, originalname, mimetype);
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

        postDoc.totalViews++;
        await postDoc.save();
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

app.post('/tests/:id/like', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
  
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
  
      try {
        const testDoc = await Test.findById(id);
  
        const hasLiked = testDoc.likes.includes(info.id);
        if (hasLiked) {
            testDoc.likes.pull(info.id);
            
            const user = await User.findOne({ _id: info.id });
            user.likedTests.pull(testDoc._id);
            await user.save();
        } else {
            testDoc.likes.push(info.id);

            const user = await User.findOne({ _id: info.id });
            if(!user.likedTests.includes(testDoc._id)) {
                user.likedTests.push(testDoc._id);
                await user.save();
            }
        }
  
        await testDoc.save();
  
        res.json({ success: true, likes: testDoc.likes.length, isLiked: !hasLiked });
      } catch (error) {
        console.error('Error toggling like:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
});

app.post('/post/:id/mobileLike', async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ error: 'Token gereklidir' });
    }

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(403).json({ error: 'Token geçersiz' });
        }
    
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

app.get('/tests/:id/likes', async (req, res) => {
    const { id } = req.params;

    try {
      const testDoc = await Test.findById(id);
        res.json({ likes: testDoc.likes.length });
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

app.get('/tests/:id/hasLiked', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
  
    jwt.verify(token, secret, {}, async (err, info) => {
      
      if (!token) {
          return res.status(404).json({ error: 'Token not found' });
      }
      if (err) throw err;
  
      try {
        const testDoc = await Test.findById(id);
        const hasLiked = testDoc.likes.includes(info.id);
        res.json({ hasLiked });
      } catch (error) {
        console.error('Error checking if user has liked:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
});

app.get('/post/:id/hasMobileLiked', async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ error: 'Token gereklidir' });
    }

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(403).json({ error: 'Token geçersiz' });
        }

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

app.post('/post/:id/mobileSuperlike', async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ error: 'Token gereklidir' });
    }

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(403).json({ error: 'Token geçersiz' });
        }
    
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

app.get('/tests/:id/superlikes', async (req, res) => {
    const { id } = req.params;

    try {
      const testDoc = await Test.findById(id);
        res.json({ superlikes: testDoc.superlikes.length });
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

app.get('/tests/:id/hasSuperLiked', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
  
    jwt.verify(token, secret, {}, async (err, info) => {
      
      if (!token) {
          return res.status(404).json({ error: 'Token not found' });
      }
      if (err) throw err;
  
      try {
        const testDoc = await Test.findById(id);
        const hasSuperLiked = testDoc.superlikes.includes(info.id);
        res.json({ hasSuperLiked });
      } catch (error) {
        console.error('Error checking if user has superliked:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
});

app.get('/post/:id/hasMobileSuperLiked', async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ error: 'Token gereklidir' });
    }

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(403).json({ error: 'Token geçersiz' });
        }

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




// OnedioTest
app.post('/tests', uploadMiddleware.single('file'), async (req, res) => {
    try {
        const cover = [];

        if (req.file) {
            const { originalname, path, mimetype } = req.file;
            const url = await uploadToS3Quests(path, originalname, mimetype);
            cover.push(url);
        }

        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) throw err;

            const { title, summary, TestTags, questions = '[]', resultMapping = '[]' } = req.body;
            const parsedQuestions = JSON.parse(questions);
            const parsedResultMapping = JSON.parse(resultMapping);

            parsedResultMapping.forEach(result => {
                if (!result.conditions || !Array.isArray(result.conditions)) {
                    throw new Error("Her sonuç için 'conditions' bir dizi olmalıdır.");
                }

                result.conditions.forEach(condition => {
                    if (!['<', '<=', '=', '>=', '>'].includes(condition.operator)) {
                        throw new Error(`Geçersiz operatör: ${condition.operator}`);
                    }
                    if (typeof condition.value !== 'number') {
                        throw new Error(`Koşul değeri bir sayı olmalıdır.`);
                    }
                });
            });

            // Test dokümanını oluşturma
            const testDoc = await Test.create({
                title,
                summary,
                cover: cover[0] || null,
                author: info.id,
                TestTags,
                questions: parsedQuestions,
                resultMapping: parsedResultMapping,
            });

            res.status(201).json({ success: true, testDoc });
        });
    } catch (error) {
        console.error('Hata oluştu:', error.message);
        res.status(500).json({ success: false, message: 'Test oluşturulamadı.', error: error.message });
    }
});



app.get('/tests', async (req, res) => {
    try {
        const tests = await Test.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(tests);
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ success: false, message: 'Testler alınamadı.', error: error.message });
    }
});

app.get('/tests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const testDoc = await Test.findById(id).populate('author', ['username', 'profilePhoto']);

        if (!testDoc) {
            return res.status(404).json({ success: false, message: 'Test bulunamadı.' });
        }
        testDoc.totalViews++;
        await testDoc.save();
        res.json(testDoc);
    } catch (error) {
        console.error('Error fetching test:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası', error: error.message });
    }
});









//? Tests  OLD
// app.post('/test', uploadMiddleware.single('file'), async (req, res) => {
//     const {originalname,path} = req.file;
//     const parts= originalname.split('.');
//     const ext = parts[parts.length - 1];
//     const newPath = path + '.' + ext;
//     fs.renameSync(path, newPath);

//     const {token} = req.cookies;
//     jwt.verify(token, secret, {}, async (err, info) => {
//         if(err) throw err;

//         const {id, title, summary, content, previev} = req.body;
//             const testDoc = await Test.create({
//                 title,
//                 summary,
//                 content,
//                 cover: newPath,
//                 author: info.id,
//                 previev,
//             });
//             res.json({testDoc});
//         });
// });

// app.put('/test', uploadMiddleware.single('file'), async (req, res) => {
//     let newPath = null;
//     if(req.file) {
//         const {originalname,path} = req.file;
//         const parts= originalname.split('.');
//         const ext = parts[parts.length - 1];
//         newPath = path + '.' + ext;
//         fs.renameSync(path, newPath);
//     }

//     const {token} = req.cookies;
//     jwt.verify(token, secret, {}, async (err, info) => {
//         if(err) throw err;
//         const {id, title, summary, content, previev} = req.body;
//         const testDoc = await Test.findById(id);
//         const isAuthor = JSON.stringify(testDoc.author) === JSON.stringify(info.id);
//         const isAdmin = info.tags.includes('admin');
//         const isModerator = info.tags.includes('moderator');
//         const isEditor = info.tags.includes('editor');
//         if(!isAuthor && !isAdmin && !isModerator && !isEditor) {
//             return res.status(400).json('You don\'t have permission.');
//         }

//         await Test.findByIdAndUpdate(id, {
//             title, 
//             summary, 
//             content, 
//             cover: newPath?newPath:testDoc.cover,
//             previev,
//         });

//         res.json(testDoc);
//     });
// });

// app.get('/test/:id', async (req, res) => {
//     const {id} = req.params;
//     const testDoc = await Test.findById(id).populate('author', ['username'])
//     res.json(testDoc);
// });

// app.delete('/test/:id', async (req, res) => {
//     const { id } = req.params;
//     const { token } = req.cookies;
//     jwt.verify(token, secret, {}, async (err, info) => {
//         if(err) throw err;
//         const testDoc = await Test.findById(id);
//         const isAuthor = JSON.stringify(testDoc.author) === JSON.stringify(info.id);
//         const isAdmin = info.tags.includes('admin');
//         const isModerator = info.tags.includes('moderator');
//         if(!isAuthor && !isAdmin && !isModerator) {
//             return res.status(400).json('Your not ADMIN!');
//         }
//         await Test.findByIdAndDelete(id);
//         res.json({ message: 'Test deleted successfully' });
//     });
// });


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
//* Web Comment 
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
//* Mobile Comment
app.post('/post/:id/mobilecomment', uploadProfilePhoto.single('file'), async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers['authorization'];    
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token gereklidir' });
    }

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(403).json({ error: 'Token geçersiz' });
        }

        const { content } = req.body;
        
        try {
            const commentDoc = await Comment.create({
                content,
                author: info.id,
                post: id,
            });

            res.json(commentDoc);
        } catch (e) {
            console.error('Error with add comment', e);
            res.status(500).json({ e: 'server error' });
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

app.get('/post/:id/comment/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const commentDoc = await Comment.findById(id)
        .populate('author', ['username', 'profilePhoto'])

        res.json(commentDoc);
    } catch (e) {
        console.error('Error with get comment',e);
        res.status(500).json({e:'server error'});
    }   
});

app.get('/comments', async (req, res) => {
    try {
        res.json(
            await Comment.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})
        );
    } catch (e) {
        console.error('Error with get comments',e);
        res.status(500).json({e:'server error'});
    }
});


app.post('/tests/:id/comment', async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;

        const { content } = req.body;
        try {
            const commentDoc = await Comment.create({
                content,
                author: info.id,
                test: id,
                post: null,
            });

            res.json(commentDoc);
        } catch (e) {
            console.error('Error with add comment', e);
            res.status(500).json({ e: 'server error' });
        }
    });
});

app.get('/tests/:id/comments', async (req, res) => {
    const { id } = req.params;
    try {
        const comments = await Comment.find({ test: id })
            .populate('author', ['username', 'profilePhoto'])
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(comments);
    } catch (e) {
        console.error('Error with get comments', e);
        res.status(500).json({ e: 'server error' });
    }
});

app.get('/tests/:id/comment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const commentDoc = await Comment.findById(id)
            .populate('author', ['username', 'profilePhoto']);

        res.json(commentDoc);
    } catch (e) {
        console.error('Error with get comment', e);
        res.status(500).json({ e: 'server error' });
    }
});

//? Delete Comment
app.delete('/post/:id/comment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Comment.findByIdAndDelete(id);
        res.json({ message: 'Comment deleted successfully' });
    } catch (e) {
        console.error('Error with delete comment',e);
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

app.get('/mentions', async (req, res) => {
    res.json(
        await User.find({},'username')
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



//? Total registered users
app.get('/totalUsers', async (req, res) => {
    res.json(
        await User.find().countDocuments()
    );
});

//? Total posts
app.get('/totalPosts', async (req, res) => {
    res.json(
        await Post.find().countDocuments()
    );
});

//? Total comments
app.get('/totalComments', async (req, res) => {
    res.json(
        await Comment.find().countDocuments()
    );
});

//? Delete User
// app.delete('/user/:id', async (req, res) => {
//     const { id } = req.params;
//     await User.findByIdAndDelete(id);
//     res.json({ message: 'User deleted successfully' });
// });


//? Delete Ticket
app.delete('/ticket/:id', async (req, res) => {
    const { id } = req.params;
    await Ticket.findByIdAndDelete(id);
    res.json({ message: 'Ticket deleted successfully' });
});




//? Payment
app.post('/payment', async (req, res) => {
    const { userId, price, paymentCard } = req.body;

    console.log("Gelen Ödeme Talebi:", req.body);

    if (!paymentCard) {
        return res.status(400).json({ message: 'PaymentCard bilgisi eksik' });
    }

    try {
        const paymentRequest = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: userId,
            price: price,
            paidPrice: price,
            currency: Iyzipay.CURRENCY.TRY,
            installment: 1,
            basketId: 'B67832',
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.API_BASE_URL}/payment/callback`,
            buyer: {
                id: userId,
                name: 'Kullanıcı',
                surname: 'Adı',
                email: 'kullanici@example.com',
                identityNumber: '11111111111',
                registrationAddress: 'Adres',
                city: 'Şehir',
                country: 'Türkiye',
                zipCode: '34732',
            },
            shippingAddress: {
                contactName: 'Kullanıcı Adı',
                city: 'Şehir',
                country: 'Türkiye',
                address: 'Adres',
                zipCode: '34732',
            },
            billingAddress: {
                contactName: 'Kullanıcı Adı',
                city: 'Şehir',
                country: 'Türkiye',
                address: 'Adres',
                zipCode: '34732',
            },
            basketItems: [
                {
                    id: 'BI101',
                    name: 'Premium Üyelik',
                    category1: 'Üyelik',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: price,
                },
            ],
            paymentCard,
        };

        iyzipay.payment.create(paymentRequest, async (err, result) => {
            if (err || result.status !== 'success') {
                console.error("Ödeme Hatası:", err || result);
                return res.status(400).json({ message: 'Ödeme başarısız', error: err || result });
            }

            try {
                const user = await User.findById(userId);

                if (!user) {
                    return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
                }

                // Premium süresini ayarla (1 ay ekle)
                const premiumExpiration = new Date();
                premiumExpiration.setMonth(premiumExpiration.getMonth() + 1);

                // Kullanıcı "user" rolünde ise sadece premium rolüyle değiştir
                if (user.tags.includes('user') && user.tags.length === 1) {
                    user.tags = ['premium'];
                } else if (!user.tags.includes('premium')) {
                    // Diğer rolleri varsa "premium" ekle
                    user.tags.push('premium');
                }

                // Premium süresini güncelle
                user.premiumExpiration = premiumExpiration;

                await user.save();

                res.status(200).json({ message: 'Ödeme başarılı, Premium aktif edildi', result });
            } catch (error) {
                console.error("Kullanıcı Güncelleme Hatası:", error);
                res.status(500).json({ message: 'Premium güncellemesi sırasında bir hata oluştu', error });
            }
        });
    } catch (error) {
        console.error("Sunucu Hatası:", error);
        res.status(500).json({ message: 'Bir hata oluştu', error });
    }
});



app.listen(3030, () => {
    console.log('Server listening on port 3030 || nodemon index.js')
});