export default function TempleNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">🙏</p>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">사찰을 찾을 수 없습니다</h1>
      <a href="/" className="bg-[#8B2500] text-white px-6 py-3 rounded-lg mt-6 inline-block">
        허브로 돌아가기
      </a>
    </div>
  );
}
