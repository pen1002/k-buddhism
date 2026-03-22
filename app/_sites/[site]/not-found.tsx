export default function TempleNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#8B2500] mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">사찰 페이지를 찾을 수 없습니다</p>
        <a
          href="https://k-buddhism.com"
          className="inline-block bg-[#8B2500] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          허브로 돌아가기
        </a>
      </div>
    </div>
  );
}
