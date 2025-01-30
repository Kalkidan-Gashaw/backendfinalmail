import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gashawkalkidan700@gmail.com",
    pass: "kayj imyo vtyo spli",
  },
});

export const sendVerificationEmail = (email, token) => {
  const verificationLink = `https://fmailfinal.vercel.app/users/verify/?token=${token}`;

  const mailOptions = {
    from: "gashawkalkidan700@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking this link: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email: ", error);
    } else {
      console.log("Verification email sent: ", info.response);
    }
  });
};
