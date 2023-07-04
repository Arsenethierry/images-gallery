import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { AuthOptions, SessionStrategy } from "next-auth"
import GoogleProvider from "next-auth/providers/google";

type GoogleAuthOptions = {
    clientId: string;
    clientSecret: string;
}
export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
        } as GoogleAuthOptions),
    ],
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    debug: process.env.NODE_ENV === "development"
}

export default NextAuth(authOptions as AuthOptions)