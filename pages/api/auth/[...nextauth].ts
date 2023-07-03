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
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        } as GoogleAuthOptions),
    ],
    // callbacks: {
    //     async redirect({ url, baseUrl }) {
    //         return '/'
    //     },
    // },
    // pages: {
    //     signIn: '/auth/signin',
    //     signOut: '/auth/signout',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    //   }
    secrete: process.env.SECRET,
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    debug: process.env.NODE_ENV === "development"
}

export default NextAuth(authOptions as AuthOptions)

// import NextAuth from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET
//     } as GoogleAuthOptions),
//   ]
// })