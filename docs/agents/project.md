# 프로젝트 구조와 개발 참고

## 분석 범위

2026-11-02 기준 저장소의 소스, 설정, npm 스크립트를 분석했다. 이 문서는 탐색 안내이며, 실제 코드와 설정이 변경되면 해당 파일을 우선하고 문서도 갱신한다.

이 프로젝트는 `@pdg/npm-template`라는 TypeScript 라이브러리 템플릿이다. 업무 도메인, 서버, 데이터베이스, UI는 없다. `src/index.ts`의 `export {};`, 문자열 소문자 변환을 확인하는 샘플 테스트 1개, 콘솔 출력 예제가 현재 구현의 전부다. 테스트 통과는 패키지 API 동작 검증을 뜻하지 않는다.

## 파일별 책임

| 경로 | 책임과 수정 시점 |
| --- | --- |
| `src/index.ts` | 번들 진입점. 외부에서 사용할 함수·클래스·타입을 명시적으로 내보낼 위치 |
| `src/` | 라이브러리 구현. 기능이 생길 때 필요한 모듈만 추가 |
| `test/template.test.ts` | 현재 샘플 테스트. 기능 추가 시 실제 API의 입력·출력과 오류를 검증하는 테스트 추가 |
| `examples/src/example.ts` | 현재 `Hello, World!` 출력. 실제 API 사용 예제가 필요하면 갱신 |
| `examples/package.json` | `tsx` 실행 환경. 루트 패키지 의존성이나 workspace 연결은 현재 없음 |
| `package.json` | 공개 진입점, 배포 파일, 개발·빌드·게시 명령 |
| `rollup.config.js` | JS 두 형식 번들, 타입 선언 생성, 배포용 선언 정리 |
| `tsconfig.json` | `src/` 대상 엄격한 타입 검사와 선언 출력 설정 |
| `tsconfig.test.json` / `jest.config.ts` | ts-jest 변환, Node 테스트 환경 설정 |
| `eslint.config.js` / `.prettierrc.cjs` | 정적 검사와 포맷 기준 |
| `.nvmrc` | Node `24.22.1` 지정 |
| `.gitignore` / `.npmignore` | Git 추적 제외 및 npm 배포 제외 설정 |
| `.git-commit.cjs` / `.git-merge.cjs` | 전체 변경 스테이징·커밋 및 원격 병합 보조 스크립트 |

## 코드에서 배포물까지

```text
src/index.ts
  └─ Rollup + TypeScript
      ├─ dist/index.js       (CommonJS 코드 출력)
      ├─ dist/index.esm.js   (ES module 코드 출력)
      └─ dist/index.d.ts    (공개 타입 선언)

test/*.test.ts ─ ts-jest ─ Node 환경 테스트
examples/src/example.ts ─ tsx ─ 콘솔 예제
```

- `package.json`의 `main`과 `exports.require`는 `dist/index.js`, `module`과 `exports.import`는 `dist/index.esm.js`, `types`와 `exports.types`는 `dist/index.d.ts`를 가리킨다.
- Rollup은 `dependencies`와 `peerDependencies`를 외부 의존성으로 처리하도록 구성돼 있다. 의존성 추가 시 번들 포함 여부와 소비자 설치 책임을 확인한다.
- 타입 선언은 `dist/`에 생성된다. Rollup의 사용자 플러그인은 `.private`로 끝나는 디렉터리와 `.private.d.ts` 파일을 제거한다. 공개 선언이 삭제 대상 타입을 참조하지 않는지 확인한다. 이는 런타임 코드의 접근 제한 기능이 아니다.
- TypeScript는 ES2017, ESNext 모듈, `strict`, `noImplicitAny`, `verbatimModuleSyntax`를 사용한다. 타입 전용 의존성에는 `import type` / `export type`을 사용한다.
- TypeScript 6의 `moduleResolution: bundler`를 사용하며, 이전 `baseUrl: ./src`를 통한 절대 경로 해석은 사용하지 않는다. 테스트 설정은 Jest와 Node 전역 타입을 명시한다.
- `@rollup/plugin-eslint`의 peer dependency 때문에 ESLint와 `@eslint/js`는 9.x를 사용한다. ESLint 9는 지원이 종료됐으므로 플러그인의 ESLint 10 지원 여부를 확인해 함께 갱신해야 한다. TypeScript는 `ts-jest`와 `typescript-eslint`의 지원 범위에 맞춰 6.x를 사용한다.
- 루트 타입 검사는 `src/`만 대상으로 한다. 예제와 테스트의 전체 검증을 대신하지 않는다.
- `npm run lint`는 `src/**/*.ts`만 검사한다. Rollup은 경고에도 실패하도록 설정돼 있으므로 lint 명령 성공만으로 번들 성공을 보장하지 않는다.

## 명령 안내

루트 기준이다. 설치된 의존성이 있어야 개발 명령을 실행할 수 있다.

| 목적 | 명령 | 주의점 |
| --- | --- | --- |
| 의존성 설치 | `npm install` | 잠금 파일은 현재 Git 제외 대상 |
| 타입 검사 | `npm run tsc` | `tsc --noEmit`, `src/` 대상 |
| 소스 정적 검사 | `npm run lint` | 테스트·예제는 검사 범위 밖 |
| 테스트 | `npm test -- --runInBand --watchman=false` | Watchman 없이 단일 프로세스로 실행 |
| 표준 빌드 | `npm run build` | Watchman 재등록과 기본 Jest 실행 포함 |
| 번들만 확인 | `./node_modules/.bin/rollup -c --bundleConfigAsCjs` | 테스트를 별도로 실행해야 함. `dist/*` 정리 후 생성 |
| 예제 실행 | `npm run dev` | `examples/` 의존성 별도 설치 필요. 현재 단발 실행이며 감시 모드 아님 |
| 배포 파일 확인 | `npm pack --dry-run` | 게시하지 않고 포함 목록 확인 |

`npm run pub`는 설치·빌드·공개 npm 게시를 수행한다. 마지막의 `|| true` 때문에 종료 코드만으로 게시 성공을 판단하면 안 된다. `git:commit`은 `git add .`를 실행하고, `reset:gitignore`는 전체 인덱스를 재구성하며, `reinstall:module`은 의존성과 잠금 파일을 삭제한다. 일반 검증 명령으로 사용하지 않는다.

## 배포·설정 변경 시 확인할 사항

1. **모듈 형식:** 패키지에 `"type": "module"`이 있는데 CommonJS 출력 경로가 `.js`이다. Node에서 해당 파일은 ESM으로 해석되므로 `require` 진입점 호환성을 보장할 수 없다. 기능 구현과 별개인 기존 설정 문제로 기록하며, 모듈 설정을 변경하거나 게시할 때 실제 패키지를 소비하는 `import` / `require` 검증을 수행한다.
2. **실행 환경:** Rollup의 `context: 'window'`는 브라우저 API 지원을 보장하지 않는다. 현재 테스트는 Node 환경이고 TypeScript `lib`는 ES2017이다. 브라우저 전용 기능을 추가하려면 지원 환경부터 정한다.
3. **배포 범위:** `files`는 `dist`, `README.md`를 지정한다. 진입점 파일 존재와 선언 파일 누락 여부는 `npm pack --dry-run`으로 확인한다. 에이전트 문서와 작업 기록을 배포물에 포함할 이유는 없다.
4. **예제 연결:** 예제에는 루트 패키지 의존성이 선언돼 있지 않다. 소스 직접 호출과 설치 패키지 소비 검증을 구분한다. 공개 진입점 검증이 목적이면 빌드된 패키지를 실제로 설치한 소비 환경이 필요하다.
5. **생성 파일:** `dist/`는 현재 Git 제외 대상이다. `.gitignore`의 주석은 최종 프로젝트에서 이를 바꿀 수 있음을 안내할 뿐, 이 저장소에서 추적하도록 설정한 것은 아니다.

## 분석 시 실행한 검증

Node `v24.22.1`, npm `11.19.1`, 기존 설치 의존성으로 다음 결과를 확인했다.

| 항목 | 결과 |
| --- | --- |
| `npm run tsc` | 통과 |
| `npm run lint` | 통과 |
| `npm test -- --runInBand --watchman=false` | 1개 테스트 통과 |
| `./node_modules/.bin/rollup -c --bundleConfigAsCjs` | 성공. 빈 진입점으로 인한 empty chunk 경고 발생 |

`npm run build` 전체, 깨끗한 의존성 재설치, npm 게시, 설치 소비자의 `import` / `require` 호환성은 검증하지 않았다. 위 기록은 분석 당시 결과이며 다음 작업의 검증을 대체하지 않는다.
