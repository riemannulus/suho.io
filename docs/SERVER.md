# Server Architecture Guide

suho.io 서비스 아키텍처와 새로운 서비스 추가 방법에 대한 개념적 가이드입니다.

## 아키텍처 개요

### 전체 구조

```
Internet
    ↓
Traefik (Reverse Proxy)
    ↓
┌─────────────────────────────────────┐
│           Docker Network            │
│                                     │
│  ┌─────────┐  ┌─────────┐  ┌──────┐ │
│  │ root    │  │ tools   │  │ ...  │ │
│  │ suho.io │  │*.suho.io│  │      │ │
│  └─────────┘  └─────────┘  └──────┘ │
└─────────────────────────────────────┘
```

### 핵심 컴포넌트

1. **Traefik**: 리버스 프록시 및 로드 밸런서
   - 자동 SSL 인증서 발급 (Let's Encrypt)
   - 동적 서비스 디스커버리
   - HTTP/HTTPS 리다이렉트

2. **Docker Compose**: 컨테이너 오케스트레이션
   - 프로필 기반 환경 분리 (dev/prod)
   - 서비스 간 네트워킹
   - 볼륨 및 환경 변수 관리

3. **GitHub Actions**: CI/CD 파이프라인
   - 자동 Docker 이미지 빌드
   - 환경별 자동 배포
   - GitOps 방식의 인프라 동기화

## 동작 원리

### 1. 요청 처리 플로우

```
1. 사용자 요청 (예: https://tools.suho.io)
   ↓
2. DNS 해석 → 서버 IP
   ↓
3. Traefik이 요청을 받음
   ↓
4. Host 헤더 기반으로 라우팅 규칙 매칭
   ↓
5. 해당 컨테이너로 프록시
   ↓
6. 애플리케이션 응답
```

### 2. 서비스 등록 과정

```
1. Docker Compose 파일에 서비스 정의
   ↓
2. Traefik 라벨을 통한 라우팅 규칙 설정
   ↓
3. 컨테이너 시작 시 Traefik이 자동 발견
   ↓
4. SSL 인증서 자동 발급 및 설정
   ↓
5. 서비스 활성화
```

### 3. 배포 파이프라인

```
Code Push → GitHub Actions
    ↓
Docker Image Build
    ↓
Image Push to Registry
    ↓
Server Deployment
    ↓
Service Update
```

## 서비스 추가 가이드

### 1. 기본 개념

새로운 서비스를 추가할 때 필요한 요소들:

- **애플리케이션 코드**: 실제 서비스 로직
- **Dockerfile**: 컨테이너 이미지 빌드 정의
- **Docker Compose 설정**: 서비스 실행 환경 정의
- **GitHub Actions 워크플로우**: CI/CD 파이프라인
- **Traefik 라우팅 규칙**: 도메인 연결

### 2. 디렉토리 구조

```
suho.io/
├── apps/
│   └── <new-app>/          # 새로운 애플리케이션
│       ├── src/
│       ├── Dockerfile
│       └── moon.yml
├── server/
│   └── <new-app>/          # Docker Compose 설정
│       ├── dev.yml
│       └── prod.yml
└── .github/workflows/
    └── build-<new-app>.yml # CI/CD 워크플로우
```

### 3. 단계별 추가 과정

#### Step 1: 애플리케이션 개발
```bash
# 새 앱 디렉토리 생성
mkdir -p apps/<new-app>
cd apps/<new-app>

# 애플리케이션 코드 작성
# Dockerfile 작성
# moon.yml 설정 (필요시)
```

#### Step 2: CI/CD 워크플로우 생성
```bash
# 자동 생성 (권장)
moon generate github-actions

# 수동 작성
# .github/workflows/build-<new-app>.yml 작성
```

#### Step 3: Docker Compose 설정
```bash
# 자동 생성 (권장)
moon generate docker-compose-service

# 수동 작성
# server/<new-app>/dev.yml
# server/<new-app>/prod.yml
```

#### Step 4: 서비스 등록
```yaml
# server/compose.yml에 추가
include:
  - path: ./<new-app>/dev.yml
  - path: ./<new-app>/prod.yml
```

### 4. 환경별 설정

#### 개발 환경 (dev.yml)
```yaml
services:
  <new-app>-dev:
    image: ${DOCKER_USERNAME}/<image-name>:${TAG:-latest}
    container_name: <new-app>-dev
    environment:
      - NODE_ENV=development
    labels:
      - "traefik.http.routers.<new-app>.rule=Host(`<subdomain>.localhost`)"
      - "traefik.http.routers.<new-app>.entrypoints=web"
    profiles:
      - dev
```

#### 프로덕션 환경 (prod.yml)
```yaml
services:
  <new-app>-prod:
    image: ${DOCKER_USERNAME}/<image-name>:${TAG:-latest}
    container_name: <new-app>-prod
    environment:
      - NODE_ENV=production
    labels:
      - "traefik.http.routers.<new-app>.rule=Host(`<subdomain>.${DOMAIN}`)"
      - "traefik.http.routers.<new-app>.entrypoints=websecure"
      - "traefik.http.routers.<new-app>.tls.certresolver=letsencrypt"
    profiles:
      - prod
```

### 5. 데이터베이스가 필요한 서비스

#### PostgreSQL 예시
```yaml
services:
  <app>-db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=<dbname>
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${<APP>_DB_PASSWORD}
    volumes:
      - <app>_db:/var/lib/postgresql/data
    networks:
      - <app>-network

volumes:
  <app>_db:

networks:
  <app>-network:
    driver: bridge
```

### 6. 보안 고려사항

- **환경 변수**: 민감한 정보는 GitHub Secrets 사용
- **네트워크 분리**: 필요시 전용 네트워크 생성
- **포트 노출**: 필요한 포트만 외부 노출
- **이미지 보안**: 정기적인 베이스 이미지 업데이트

### 7. 성능 고려사항

- **리소스 제한**: CPU/메모리 제한 설정
- **헬스체크**: 컨테이너 상태 모니터링
- **로그 관리**: 로그 로테이션 및 보관 정책
- **캐싱**: Redis 등 캐시 레이어 활용

## 서비스 유형별 가이드

### Web Application
- 정적 파일 서빙
- API 엔드포인트 제공
- 사용자 인터페이스

### API Service
- RESTful API
- GraphQL API
- 마이크로서비스

### Background Service
- 배치 작업
- 큐 처리
- 데이터 동기화

### Database Service
- PostgreSQL
- Redis
- MongoDB

## 모니터링 및 로깅

### 기본 모니터링
```bash
# 컨테이너 상태
docker compose ps

# 리소스 사용량
docker stats

# 로그 확인
docker compose logs -f <service>
```

### 고급 모니터링 (선택사항)
- Prometheus + Grafana
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Jaeger (분산 추적)

## 문제 해결

### 일반적인 문제들

1. **컨테이너가 시작되지 않음**
   - 로그 확인
   - 환경 변수 검증
   - 포트 충돌 확인

2. **도메인 접근 불가**
   - Traefik 라우팅 규칙 확인
   - DNS 설정 확인
   - SSL 인증서 상태 확인

3. **성능 문제**
   - 리소스 사용량 모니터링
   - 데이터베이스 쿼리 최적화
   - 캐싱 전략 검토

### 디버깅 도구

```bash
# 컨테이너 내부 접근
docker compose exec <service> sh

# 네트워크 연결 테스트
docker compose exec <service> curl -I http://other-service:port

# 환경 변수 확인
docker compose exec <service> env
```

## 확장성 고려사항

### 수평적 확장
- 로드 밸런싱
- 서비스 복제
- 데이터베이스 샤딩

### 수직적 확장
- 리소스 제한 조정
- 하드웨어 업그레이드
- 성능 튜닝

이 가이드는 suho.io 인프라에 새로운 서비스를 안전하고 효율적으로 추가하는 데 필요한 모든 개념과 방법을 다룹니다.