import { sendEmail } from "../lib/mail";

export const sendResetPasswordEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  sendEmail({
    from: "agro-partners@example.com",
    to: email,
    subject: "Reset Password",
    html:
      "<a href='http://localhost:5000/reset/?email=" +
      email +
      "&token=" +
      token +
      "'>Click here to reset your password</a>",
  });
};
export const sendAccountVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  sendEmail({
    from: "agro-partners@example.com",
    to: email,
    subject: "Account Verification",
    html: `<a href='http://localhost:5000/verify/?email=${email}&token=${token}'>Click here to verify your account</a>`,
  });
};
export const sendAddedUserPasswordGeneratedBySystem = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  sendEmail({
    from: "agro-partners@example.com",
    to: email,
    subject: "Account Verification",
    html: `<p>Your account has been created. Here is your password: ${password}</p>`,
  });
};
