# 프로젝트 구조와 개발 참고

## 프로젝트와 공개 API

2026-11-02 기준 소스와 설정을 분석했다. 실제 코드와 설정이 바뀌면 해당 파일을 우선하고 이 문서도 갱신한다.

`@pdg/url`은 TypeScript URL 문자열 조합 유틸리티다. `src/index.ts`는 `urlJoin`을 named export로 내보내고, 같은 함수를 `join` 속성으로 가진 객체를 default export로 내보낸다. `urlJoin(...parts: string[]): string`은 조각을 순서대로 이어 붙이며 경계의 슬래시를 조정하고 `?`로 시작하는 조각 앞에는 슬래시를 추가하지 않는다. URL 파싱이나 인코딩을 수행하지 않는다. 현재 테스트는 일반 경로와 경계 슬래시를 검증하며, 쿼리·빈 입력 등 모든 경우를 다루지는 않는다.

| 경로 | 책임 |
| --- | --- |
| `src/index.ts` | named/default 공개 진입점 |
| `src/urlJoin.ts` | URL 조각 조합 구현 및 모듈 자체의 default export |
| `test/urlJoin.test.ts` | 공개 named export를 이용한 동작 테스트 |
| `examples/src/example.ts` | 현재 콘솔 출력 예제; 패키지를 사용하지 않음 |
| `examples/package.json` | 별도의 `tsx` 실행 환경; 루트 패키지 연결 없음 |
| `package.json` / `rollup.config.js` | 배포 진입점·스크립트와 JS 번들·타입 선언 생성 |
| `tsconfig.json` / `tsconfig.test.json` / `jest.config.ts` | 소스 타입 검사 및 ts-jest Node 테스트 설정 |
| `eslint.config.js` / `.prettierrc.cjs` | 정적 검사 및 포맷 설정 |
| `.nvmrc` | Node `24.22.1` 지정 |
| `.gitignore` / `.npmignore` | Git 및 npm 제외 설정 |
| `.git-commit.cjs` / `.git-merge.cjs` | 커밋 및 원격 병합 보조 스크립트 |

## 빌드와 배포

Rollup은 `src/index.ts`에서 CommonJS `dist/index.js`, ES module `dist/index.esm.js`, 타입 선언을 생성한다. `package.json`의 `main`/`exports.require`, `module`/`exports.import`, `types`/`exports.types`가 각각 이를 가리킨다. `dist/`는 Git에서 추적하므로 빌드 전에 기존 변경을 확인하고 빌드 후 생성물 diff를 검토한다. 직접 편집하지 않는다.

패키지에 `"type": "module"`이 설정돼 있지만 CommonJS 출력의 확장자는 `.js`다. Node는 해당 파일을 ES module로 해석하므로 `require` 진입점 호환성을 보장할 수 없다. 배포 설정을 변경하거나 게시할 때 실제 패키지를 설치한 환경에서 `import`, `require`, 타입 해석을 확인한다.

Rollup은 `dependencies`와 `peerDependencies`를 외부 의존성으로 처리한다. 사용자 플러그인은 `.private`로 끝나는 디렉터리와 `.private.d.ts` 파일을 제거하므로 공개 선언이 삭제 대상 타입을 참조하지 않는지 확인한다. `context: 'window'`는 브라우저 지원을 보장하지 않는다. 현재 테스트 환경은 Node다.

TypeScript는 ES2017, ESNext 모듈, `moduleResolution: bundler`, 엄격한 검사와 `verbatimModuleSyntax`를 사용한다. 루트 타입 검사와 lint는 `src/`만 대상으로 하며 테스트·예제를 대체하지 않는다. Rollup의 ESLint 플러그인은 경고에도 실패하도록 설정돼 있다.

## 명령 안내

루트 기준이며 설치된 의존성이 필요하다. 잠금 파일은 Git 제외 대상이다.

| 목적 | 명령 | 주의점 |
| --- | --- | --- |
| 의존성 설치 | `npm install` | 예제 의존성은 `examples/`에서 별도 설치 |
| 타입 검사 | `npm run tsc` | `src/` 대상 `tsc --noEmit` |
| 정적 검사 | `npm run lint` | `src/**/*.ts` 대상 |
| 테스트 | `npm test -- --runInBand --watchman=false` | Watchman 없이 단일 프로세스 실행 |
| 표준 빌드 | `npm run build` | Watchman 재등록, 기본 Jest 실행, Rollup 순서; `dist/` 재생성 |
| 번들만 확인 | `./node_modules/.bin/rollup -c --bundleConfigAsCjs` | 테스트 별도 실행 필요; `dist/*` 정리 후 생성 |
| 예제 실행 | `npm run dev` | `examples/` 의존성 필요; 단발 실행 |
| 배포 파일 확인 | `npm pack --dry-run` | 게시하지 않고 포함 목록 확인 |

`npm run pub`는 설치·빌드·공개 npm 게시를 수행한다. 마지막 `|| true` 때문에 종료 코드만으로 게시 성공을 판단하면 안 된다. `git:commit`은 전체 변경을 스테이징하고, `reset:gitignore`는 인덱스를 재구성하며, `reinstall:module`은 의존성과 잠금 파일을 삭제한다. 일반 검증에 사용하지 않는다.

`files`는 `dist`와 `README.md`를 지정한다. 예제는 패키지를 사용하지 않으므로 예제 실행만으로 배포 진입점을 검증할 수 없다. 공개 API나 배포 설정 변경 시 테스트와 문서뿐 아니라 패키지 내용, 실제 소비 환경 및 생성 선언을 확인한다.
