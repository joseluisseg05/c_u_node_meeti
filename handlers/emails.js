const nodemailer = require('nodemailer')
const ejs = require('ejs');

const fs = require('fs');

const emailConfig = require('../config/email')


let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password
    }
});



exports.enviar = async(opciones) => {
    const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`;
    const compilar = ejs.compile(fs.readFileSync(archivo, 'utf-8'));
    const html = compilar({
        url: opciones.url,
        nombre: opciones.usuario.nombre
    });
    const opcEmail = {
        from: 'MeetiUp<no-reply@mtu.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        html,
    };
    
    await transport.sendMail(opcEmail);
}