import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      return session
    },
    async jwt({ token, user }: any) {
      return token
    },
    async redirect({ url, baseUrl }: any) {
      // always send user to dashboard after login
      return `${baseUrl}/dashboard`
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
