import create from 'zustand'
import { supabase } from './supabase'

interface UserProfile {
  id: string
  city_id: number
  city_name?: string
  preferred_categories: number[]
}

interface AuthStore {
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  loadProfile: (userId: string) => Promise<void>
  clearProfile: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  loadProfile: async (userId: string) => {
    try {
      // 사용자 프로필 정보 로드
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          city_id,
          cities:city_id (
            name_vi
          )
        `)
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      // 선호 카테고리 로드
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('user_preferred_categories')
        .select('depth2_id')
        .eq('user_id', userId)

      if (categoriesError) throw categoriesError

      set({
        profile: {
          id: profileData.id,
          city_id: profileData.city_id,
          city_name: profileData.cities?.name_vi,
          preferred_categories: categoriesData.map(c => c.depth2_id)
        }
      })
    } catch (error) {
      console.error('프로필 로드 실패:', error)
      set({ profile: null })
    }
  },
  clearProfile: () => set({ profile: null })
})) 