import { z } from "zod";
import { addUserSchema } from "../../../validation/user";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../../../services/auth.service";
import { createOrUpdateAddress } from "../../../services/address.service";
import { createUser } from "../../../services/user.service";
import { sendAddedUserPasswordGeneratedBySystem } from "../../../services/mail.service";

export const executeAddUserSteps = async (
  data: z.infer<typeof addUserSchema>
) => {
  const { email, name, status, address } = data;
  const password = uuidv4();
  const hashedPassword = await hashPassword({ password });
  const _address =
    address && (await createOrUpdateAddress({ ...address, id: address?.id }));
  const user = await createUser({
    email,
    hashedPassword,
    status,
    name,
    addressId: _address?.id,
  });
  sendAddedUserPasswordGeneratedBySystem({
    email,
    password,
  });
  return {
    email: user.email,
    id: user.id,
    name: user.name,
  };
};
