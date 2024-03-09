const nodemailer = require('nodemailer')
const {htmlToText} = require('html-to-text');
const pug = require('pug');
const { options } = require('../routers/userRoutes');

module.exports =   class Email{
    constructor(user , url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = 'zeeshan malik < zeeshan@gmail.com';
    }
    newTransport(){
        if(process.env.NODE_ENV == 'production'){
            //sendGrid
            const transport = nodemailer.createTransport({
                host: "smtp-relay.brevo.com",
                port: "465",
                secure: true,
                auth: {
                  user: "zeeshan1122malik1122@gmail.com",    // fastmail email as smtp server user
                  pass: "y?k52Dg2w!/JfGY"      // fastmail app password
                },
              });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user:  process.env.EMAIL_USERNAME,
                pass: process.env.PASSWORD
            },
        })
    }
    //send the actual email
     async send(template , subject){
        //1 render html based email based on pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
            firstName: this.firstName,
            url: this.url,
            subject
        })
        //2 define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        
        };
        //3. create a transport and sends the email
        
        await this.newTransport().sendMail(mailOptions)
    }
    async sendWelcome(){
       await this.send('welcome' , 'welcome to the nattours family');
    }
    async passwordReset(){
        await this.send('forgetPassword' , 'this password is valid for 4 min only.')
    }
}


