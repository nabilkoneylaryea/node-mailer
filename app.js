const express = require('express');
const bodyParser = require('body-parser');
const exbhps = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// View engine setup (THIS PART USES HANDLEBARS)
app.engine('handlebars', exbhps());
app.set('view engine', 'handlebars');

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// ROUTING TO RENDER A SPECIFIC PAGE
app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    // ABLE TO CALL req.body BC OF BODY PARSER
    // console.log(req.body);
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone Number: ${req.body.phone}</li>
    <ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'nkoney14@outlook.com', // generated ethereal user
            pass: 'filed37402504', // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let mailOptions = {
        from: '"Nodemailer Contact 👻" <nkoney14@outlook.com>', // sender address
        to: "nkoney14@gmail.com", // list of receivers
        subject: "Node Contact Request", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        res.render('contact', {msg: 'Email has been sent'});
        console.log('Message sent: ' + info.response);
    });
    
});

app.listen(3000, () => console.log('Server started...'));