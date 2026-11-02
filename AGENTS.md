# 에이전트 코딩 가이드

## 프로젝트

TypeScript 라이브러리를 npm 패키지로 만들기 위한 템플릿이다. 현재 공개 기능은 없으며 `src/index.ts`는 빈 내보내기만 가진다. 서비스나 웹 애플리케이션을 전제로 설계하지 않는다.

- 구현과 공개 API: `src/`, `src/index.ts`
- 동작 검증: `test/`
- 사용 예제: `examples/src/` (별도 npm 프로젝트)
- 빌드 결과: `dist/` (생성 파일이므로 직접 수정하지 않는다)
- 프로젝트 분석과 설정상 주의점: [구조 문서](docs/agents/project.md)
- 반복 코딩 절차: [코딩 스킬](.agents/skills/npm-package-development/SKILL.md)

## 작업 원칙

1. 시작할 때 `git status --short`와 관련 소스·설정을 읽고 기존 변경을 보존한다.
2. 요청한 기능에 필요한 범위만 수정한다. 공개 API 변경은 진입점, 타입 선언, 테스트, README, 예제에 미치는 영향을 확인한다.
3. 문서와 작업 결과는 한글로 작성한다. 식별자와 명령은 원래 표기를 사용한다.
4. 배포 경로와 모듈 형식의 관계를 유지한다. 현재 설정의 잠재적 문제는 구조 문서를 참고하고, 배포 관련 변경 시 실제 소비 환경으로 검증한다.
5. 커밋·푸시·npm 게시 명령은 해당 작업이 요청됐을 때만 실행한다. 특히 `npm run pub`는 실제 게시를 수행한다.

## 검증

`.nvmrc`의 Node 버전과 npm을 사용한다. 의존성이 없으면 루트에서 `npm install`, 예제를 실행할 때는 `examples/`에서도 별도로 설치한다. 잠금 파일은 현재 `.gitignore` 대상이다.

```sh
npm run tsc
npm run lint
npm test -- --runInBand --watchman=false
```

빌드 변경 시 `npm run build`를 확인한다. 이 명령은 Watchman 감시 설정 재등록 → 테스트 → Rollup 순으로 실행된다. Watchman이 없거나 접근 오류가 발생하면 위 테스트와 `./node_modules/.bin/rollup -c --bundleConfigAsCjs`를 각각 실행하고, 표준 빌드 전체를 통과한 것으로 보고하지 않는다.

문서만 수정할 때는 링크·경로·명령의 실제 설정 일치 여부를 확인한다. 완료 보고에는 변경 내용, 실행한 검증과 결과, 미확인 사항을 남긴다.
