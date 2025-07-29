# suho.io

개인 도메인 `suho.io`와 모든 서브도메인(`*.suho.io`)에 대한 애플리케이션 및 서비스 관리 저장소입니다.

## 🏗️ 아키텍처

- **Runtime**: Bun (JavaScript runtime)
- **Build System**: Moon (task runner & monorepo management)
- **Infrastructure**: Docker Compose + Traefik
- **CI/CD**: GitHub Actions (GitOps)
- **SSL**: Let's Encrypt (자동 갱신)

## 📁 프로젝트 구조

```
suho.io/
├── apps/                   # 애플리케이션들
│   ├── root/              # 메인 사이트 (suho.io)
│   └── tools/             # 도구 모음 (tools.suho.io)
├── packages/              # 공유 라이브러리
│   └── multitools/        # 유틸리티 패키지
├── server/                # Docker Compose 설정
│   ├── common/           # 공통 리소스 (네트워크, 볼륨)
│   ├── traefik/          # 리버스 프록시 설정
│   ├── tools/            # tools 서비스 설정
│   └── root/             # root 서비스 설정
├── templates/             # 코드 생성 템플릿
│   ├── github-actions/   # CI/CD 워크플로우 템플릿
│   ├── docker-compose-service/ # Docker 서비스 템플릿
│   └── tools/            # 도구 컴포넌트 템플릿
├── .github/workflows/     # GitHub Actions 워크플로우
└── docs/                 # 문서
```

## 🚀 빠른 시작

### 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/your-username/suho.io.git
cd suho.io

# 의존성 설치
bun install

# 개발 서버 시작 (예: tools 앱)
moon run tools:dev
```

### 프로덕션 배포

```bash
# Docker 네트워크 생성
docker network create web

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집 (DOMAIN, LETSENCRYPT_EMAIL 등)

# 프로덕션 환경 시작
docker compose --profile prod up -d
```

## 📖 문서

- **[운영 가이드](docs/OPS.md)**: 서버 배포 및 관리 방법
- **[서버 아키텍처](docs/SERVER.md)**: 새로운 서비스 추가 방법과 동작 개념
- **[기여 가이드](CONTRIBUTING.md)**: 개발 환경 설정 및 기여 방법

## 🛠️ 개발 워크플로우

### 새로운 도구 추가 (tools 앱)
```bash
moon run tools:new-tool
```

### 새로운 애플리케이션 추가
```bash
# 1. GitHub Actions 워크플로우 생성
moon generate github-actions

# 2. Docker Compose 서비스 설정 생성
moon generate docker-compose-service

# 3. server/compose.yml에 서비스 추가
# 4. 코드 커밋 및 푸시 → 자동 배포
```

### 일반적인 명령어
```bash
# 모든 프로젝트 빌드
moon run :build

# 특정 앱 개발 서버 시작
moon run <app>:dev

# 특정 앱 타입 체크
moon run <app>:type-check

# 테스트 실행
moon run <app>:test
```

## 🌐 서비스 목록

| 서비스 | 도메인 | 설명 |
|-------|--------|------|
| Root | [suho.io](https://suho.io) | 메인 개인 웹사이트 |
| Tools | [tools.suho.io](https://tools.suho.io) | 웹 도구 모음집 |

## 🔧 기술 스택

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components
- **Bun** for bundling (no Vite/Webpack)

### Backend
- **Bun** runtime (instead of Node.js)
- **TypeScript** throughout
- **Docker** for containerization

### Infrastructure
- **Traefik** (reverse proxy, SSL termination)
- **Docker Compose** (container orchestration)
- **Let's Encrypt** (SSL certificates)
- **GitHub Actions** (CI/CD)

### Development Tools
- **Moon** (build system, task runner)
- **Bun** (package manager, test runner)
- **Proto** (toolchain version management)

## 📝 환경 변수

프로덕션 배포를 위해 다음 환경 변수들을 설정해야 합니다:

```bash
# .env 파일
DOMAIN=suho.io
LETSENCRYPT_EMAIL=your-email@example.com
TRAEFIK_AUTH=admin:$2y$10$...  # htpasswd로 생성
DOCKER_USERNAME=your-dockerhub-username
```

## 🔐 GitHub Secrets

CI/CD 파이프라인을 위해 다음 Secrets을 설정해야 합니다:

- `DOCKER_USERNAME` - Docker Hub 사용자명
- `DOCKER_PASSWORD` - Docker Hub 패스워드/토큰
- `DEPLOY_HOST` - 배포 서버 호스트명
- `DEPLOY_USER` - SSH 사용자명
- `DEPLOY_SSH_KEY` - SSH 개인키
- `DEPLOY_PATH` - 서버의 저장소 경로
- 기타 환경별 설정값들

## 📊 모니터링

- **Traefik Dashboard**: https://traefik.suho.io (Basic Auth 필요)
- **서비스 상태**: `docker compose --profile prod ps`
- **로그 확인**: `docker compose logs -f <service-name>`

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. feature 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 개인 사용을 위한 저장소입니다.

## 📞 문의

- 웹사이트: [suho.io](https://suho.io)
- 이메일: your-email@suho.io

---

이 저장소는 [Moon](https://moonrepo.dev/)과 [Bun](https://bun.sh/)을 활용한 현대적인 모노레포 구조로 관리됩니다.
