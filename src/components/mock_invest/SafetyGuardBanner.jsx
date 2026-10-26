export default function SafetyGuardBanner({ onOpenCompanyInfo, onProceed }) {
  return (
    <div>
      <p>💡 거래 전에 잠깐! PBR을 확인하셨나요?</p>
      <button onClick={onOpenCompanyInfo}>기업정보 보기</button>
      <button onClick={onProceed}>확인 및 진행</button>
    </div>
  );
}