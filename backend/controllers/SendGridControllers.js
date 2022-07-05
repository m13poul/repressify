const mail = require("@sendgrid/mail");
mail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.contact = async (req, res) => {
  const message = `
    Name: ${req.body.fname}\r\n
    Email: ${req.body.email}\r\n
    Message: ${req.body.textarea}\r\n
    Subject: ${req.body.subject}
  `;
  const data = {
    to: process.env.EMAIL_RECIPIENT,
    from: process.env.EMAIL_SENDER,
    subject: "New Message",
    text: message,
    html: message.replace(/\r\n/g, "<br>"),
  };
  const result = await mail.send(data);
  res.json();
};
