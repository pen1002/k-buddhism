export default function TempleNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">🙏</p>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">사찰을 찾을 수 없습니다</h1>
      <p className="text-stone-500 mb-8">요청하신 사찰 페이지가 존재하지 않거나 이동되었습니다.</p>
      <a href="/" className="bg-[#8B2500] text-white px-6 py-3 rounded-lg hover:opacity-90">
        108사찰 허브로 돌아가기
      </a>
    </div>
  );
}
