import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "~/config/dbConnect";
import bcrypt from "bcryptjs"
import { env } from "~/env";
import User from "~/models/User.model";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      email: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
        token.email = user.email;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        username: token.username,
        email: token.email,
      },
    }),
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('No user found with this email');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password ?? ''
          );
          if (isPasswordCorrect) {
            return {
              id: user._id?.toString() ?? '',
              username: user.username ?? '',
              email: user.email ?? '',
            };
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
