import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
// add more providers here if needed

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
})
