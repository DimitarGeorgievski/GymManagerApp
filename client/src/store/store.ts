import { useUserStore } from "./useUser"

export const useStores = () => ({
    user: useUserStore(),
})