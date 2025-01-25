export const TreatmentBanner = () => {
  return (
    <div className="relative h-48">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://image2.gnsister.com/images/hospital/1569818628941_49deedf59c924e248e83b4a9321e9030.png?f=webp)'
        }}
      />
      
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* 컨텐츠 */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
        <h2 className="text-4xl font-bold mb-2">시술 정보</h2>
        <p className="text-lg">원하시는 시술 정보를 찾아보세요</p>
      </div>
    </div>
  )
} 