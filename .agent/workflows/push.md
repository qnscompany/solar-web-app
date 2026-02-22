---
description: 변경 사항을 GitHub에 푸시하는 방법
---

// turbo-all
마케팅 페이지 작업이나 수정 사항을 GitHub 저장소에 안전하게 푸시하려면 다음 단계를 따르세요.

1. **변경 사항 스테이징**: 수정된 모든 파일을 준비 영역에 추가합니다.
```powershell
git add .
```

2. **커밋 메시지 작성**: 수행한 작업에 대한 짧은 설명을 남깁니다.
```powershell
git commit -m "feat: 마케팅 랜딩 페이지 구현 및 종속성 업데이트"
```

3. **저장소로 푸시**: 로컬의 변경 사항을 GitHub `main` 브랜치에 반영합니다.
```powershell
git push origin main
```

> [!TIP]
> 만약 인증 오류가 발생하면 `gh auth login` 명령어를 통해 로그인을 다시 진행하거나, VS Code의 원격 저장소 푸시 기능을 사용해 보세요.
