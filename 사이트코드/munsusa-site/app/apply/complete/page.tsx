// 입주 신청 완료 페이지
export default function ApplyCompletePage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#faf7f2',
      fontFamily: 'Pretendard, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: '48px 40px',
        maxWidth: '480px', width: '100%', textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        {/* 아이콘 */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: '#fef3c7', margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '40px',
        }}>
          🙏
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1f2937', marginBottom: '16px' }}>
          신청이 접수되었습니다
        </h1>

        <p style={{ fontSize: '20px', color: '#4b5563', lineHeight: 1.8, marginBottom: '32px' }}>
          입주 신청을 감사히 받았습니다.<br />
          관리자 검토 후 <strong>1~3 영업일 내</strong><br />
          연락처로 승인 결과를 안내드립니다.
        </p>

        <div style={{
          background: '#fef9e7', border: '1px solid #fde68a',
          borderRadius: '12px', padding: '20px', marginBottom: '32px',
          fontSize: '17px', color: '#92400e', lineHeight: 1.7,
        }}>
          <p style={{ fontWeight: 700, marginBottom: '8px' }}>안내 사항</p>
          <p>• 승인 전까지 홈페이지는 공개되지 않습니다.</p>
          <p>• 추가 서류 요청 시 연락드릴 수 있습니다.</p>
          <p>• 문의: 108temple@gmail.com</p>
        </div>

        <a
          href="/"
          style={{
            display: 'inline-block', padding: '18px 48px',
            background: '#8B2500', color: '#fff', borderRadius: '14px',
            fontSize: '20px', fontWeight: 700, textDecoration: 'none',
          }}
        >
          처음으로 돌아가기
        </a>
      </div>
    </div>
  )
}
