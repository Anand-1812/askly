import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { account } from "@/modles/client/config"
import { AppwriteException, ID, Models } from "appwrite"

export interface UserPrefs {
  reputation: number
}

interface IAuthStore {
  session: Models.Session | null
  jwt: string | null
  user: Models.User<UserPrefs> | null
  hydrated: boolean

  setHydrated(): void
  verifySession(): Promise<void>

  login(
    email: string,
    password: string
  ) : Promise<{success: boolean;error?: AppwriteException | null}>

  createAccount(
    name: string,
    email: string,
    password: string
  ) : Promise<{success: boolean;error?: AppwriteException | null}>

  logout(): Promise<void>
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() { set({ hydrated: true }) },

      async verifySession() {
        try {
          const session = await account.getSession("current");
          set({ session })
        } catch (error: any) {
          console.log(error)
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(email, password)
          const [user, {jwt}] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT()
          ])
        } catch (error: any) {
          return { success: false, error: error instanceof AppwriteException ? error : null }
        }
      },

      async createAccount(name: string, email: string, password: string) {

      },

      async logout() {

      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated()
        }
      }
    }
  )
)
