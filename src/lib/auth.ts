import { AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface UserProfile {
  id: string
  city_id: number
  city_name?: string
  preferred_categories: number[]
}

export async function signIn(email: string, password: string) {
  try {
    // 1. 먼저 로그인
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      // 에러 메시지만 반환
      if (authError instanceof AuthError) {
        switch (authError.message) {
          case 'Invalid login credentials':
            return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
          case 'Email not confirmed':
            return { error: '이메일 인증이 필요합니다.' }
          case 'Too many requests':
            return { error: '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.' }
          default:
            return { error: '로그인 중 오류가 발생했습니다.' }
        }
      }
      return { error: '로그인 중 오류가 발생했습니다.' }
    }

    if (!authData.user) {
      return { error: '로그인 실패: 사용자 정보를 찾을 수 없습니다.' }
    }

    // 2. 프로필 정보 로드
    const profile = await loadUserProfile(authData.user.id)
    if (!profile) {
      return { error: '프로필 정보를 불러올 수 없습니다.' }
    }

    // 3. 사용자 메타데이터 업데이트
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        city_id: profile.city_id,
        preferred_categories: profile.preferred_categories
      }
    })

    if (updateError) {
      return { error: '사용자 정보 업데이트 중 오류가 발생했습니다.' }
    }

    return { user: authData.user }
  } catch (error) {
    return { error: '알 수 없는 오류가 발생했습니다.' }
  }
}

export async function loadUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // 사용자 프로필 정보 로드
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        id,
        city_id
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

    return {
      id: profileData.id,
      city_id: profileData.city_id,
      preferred_categories: categoriesData.map(c => c.depth2_id)
    }
  } catch (error) {
    console.error('프로필 로드 실패:', error)
    return null
  }
} 