'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SamplePage() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Supabase 시스템 정보 조회로 연결 테스트
        const { data, error } = await supabase
          .from('test_connection')
          .select('*')
          .limit(1)

        if (error) {
          setError(error.message)
          setIsConnected(false)
          return
        }

        setIsConnected(true)
        // 연결 성공 시 버전 정보 설정
        const { data: versionData } = await supabase
          .from('pg_stat_database')
          .select('version')
          .single()
        
        if (versionData) {
          setVersion(versionData.version)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase 연결 테스트</h1>
      
      <div className="space-y-6">
        {/* 연결 상태 표시 */}
        <div className="p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">연결 상태</h2>
          {isConnected === null ? (
            <div className="text-yellow-600">연결 확인 중...</div>
          ) : isConnected ? (
            <div className="text-green-600">✅ Supabase에 성공적으로 연결되었습니다!</div>
          ) : (
            <div className="text-red-600">❌ 연결 실패</div>
          )}
        </div>

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h2 className="text-lg font-semibold mb-2 text-red-700">에러 발생</h2>
            <pre className="text-red-600 text-sm">{error}</pre>
          </div>
        )}

        {/* 버전 정보 표시 */}
        {version && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">데이터베이스 정보</h2>
            <pre className="bg-white p-4 rounded border text-sm">
              {version}
            </pre>
          </div>
        )}

        {/* 환경 변수 확인 */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">환경 변수 확인</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? '설정됨 ✅' : '설정되지 않음 ❌'}
            </p>
            <p className="text-sm">
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨 ✅' : '설정되지 않음 ❌'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 