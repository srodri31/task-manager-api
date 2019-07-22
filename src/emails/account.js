const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "santiago.rp@globant.com",
        subject: "Thanks for being part of task manager",
        text: `Welcome ${name}, I hope you like the app`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "santiago.rp@globant.com",
        subject: "Goodbye Fella",
        text: `It's been a pleasure ${name}, we wish the best. from all our fellas here in Task Manager`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}