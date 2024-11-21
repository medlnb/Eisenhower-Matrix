import nodemailer from "nodemailer";

export const sendEmail = async (email: string, newCode: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification From Heisenberg Matrix",
      text: `Your verification code is ${newCode}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw error;
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
