// DO-01 후원 계좌
import { TempleData } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface Props {
  blockData: Cfg
  temple: TempleData
}

export default function DonationBlock({ blockData, temple }: Props) {
  // 계좌 정보가 전혀 없으면 빈 껍데기 숨김
  const hasAccounts = Array.isArray(blockData.accounts) && blockData.accounts.length > 0
  const hasLegacy = blockData.bankName || blockData.accountNumber
  if (!hasAccounts && !hasLegacy) return null

  return (
    <section className="section" id="donate">
      <div className="section-inner">
        <p className="section-label">Support &amp; Donation</p>
        <h2 className="section-title">나눔에 동참하세요</h2>
        <p className="section-desc">여러분의 소중한 후원이 사찰과 지역사회 발전의 원동력이 됩니다</p>
        <div className="donate-grid">
          {Array.isArray(blockData.accounts) && blockData.accounts.length > 0 ? (
            (blockData.accounts as Array<{ title?: string; bank?: string; accountNumber?: string; accountHolder?: string; phone?: string }>)
              .map((acc, i) => (
                <div key={i} className="donate-card fade-in">
                  <h3>{acc.title || '🏦 후원 계좌'}</h3>
                  <div className="bank-info">
                    {[
                      ['은행', acc.bank || '-'],
                      ['예금주', acc.accountHolder || '-'],
                      ['계좌번호', acc.accountNumber || '-'],
                      ['후원문의', acc.phone || '-'],
                    ].map(([k, v]) => (
                      <div key={k} className="bank-row"><span>{k}</span><span>{v}</span></div>
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <>
              <div className="donate-card fade-in">
                <h3>🏦 후원 계좌</h3>
                <div className="bank-info">
                  {[
                    ['은행', blockData.bankName || '-'],
                    ['예금주', blockData.accountHolder || temple.name],
                    ['계좌번호', blockData.accountNumber || '-'],
                  ].map(([k, v]) => (
                    <div key={k} className="bank-row"><span>{k}</span><span>{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="donate-card fade-in">
                <h3>📞 후원 문의</h3>
                <div className="bank-info">
                  {[
                    ['대표 전화', blockData.phone || temple.phone || '-'],
                    ['이메일', blockData.email || temple.email || '-'],
                    ['운영시간', blockData.hours || '평일 09:00~18:00'],
                  ].map(([k, v]) => (
                    <div key={k} className="bank-row"><span>{k}</span><span>{v}</span></div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
