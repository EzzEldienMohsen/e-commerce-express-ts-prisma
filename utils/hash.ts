import crypto from 'node:crypto';

export const hashUserPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  // scryptSync returns Buffer
  const hashedPassword = crypto.scryptSync(password, salt, 64) as Buffer;
  return `${hashedPassword.toString('hex')}:${salt}`;
};

export const verifyPassword = (
  storedPassword: string,
  suppliedPassword: string
): boolean => {
  const parts = storedPassword.split(':');
  if (parts.length !== 2) {
    throw new Error(
      'Invalid stored password format. Expected "hashedPassword:salt".'
    );
  }

  const [hashedPassword, salt] = parts;
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
  const suppliedPasswordBuf = crypto.scryptSync(
    suppliedPassword,
    salt,
    64
  ) as Buffer;
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
};
