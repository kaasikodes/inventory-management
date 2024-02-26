import { createTransport } from "nodemailer";
import config from "../../_config";

const transport = createTransport({
  host: "smtp.mailtrap.io",
  port: config.mail.port,
  auth: {
    user: config.mail.user,
    pass: config.mail.password,
  },
});
export const sendEmail = (props: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) => {
  transport.verify(function (error, success) {
    if (success) {
      transport.sendMail(
        {
          ...props,
        },
        (error, info) => {
          if (error) {
            return console.log(error, "Error sending Email");
          }
          console.log("Message sent: %s", info.messageId);
        }
      );
    }
    if (error) {
      console.log(error, "Error verifying mail server");
    } else {
      console.log("Server is ready to take our messages");
    }
  });
};
