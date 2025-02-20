import NextAuth from "next-auth"
import { authConfig } from "@/lib/prisma-adapter"

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
