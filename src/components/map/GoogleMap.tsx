'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface GoogleMapProps {
  latitude: number
  longitude: number
  zoom?: number
}

export function GoogleMap({ latitude, longitude, zoom = 15 }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly'
      })

      const { Map } = await loader.importLibrary('maps')

      const position = { lat: latitude, lng: longitude }
      
      const map = new Map(mapRef.current!, {
        center: position,
        zoom: zoom,
        mapId: 'YOUR_MAP_ID' // 선택사항: 스타일링된 맵을 사용하려면 필요
      })

      // 마커 추가
      new google.maps.Marker({
        position,
        map,
        title: 'Hospital Location'
      })
    }

    if (latitude && longitude) {
      initMap()
    }
  }, [latitude, longitude, zoom])

  return <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-lg" />
} 