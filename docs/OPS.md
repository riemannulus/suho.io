# Operations Guide

suho.io 도메인 인프라의 배포 및 운영 관리 가이드입니다.

## 개요

이 저장소는 `suho.io`와 모든 서브도메인(`*.suho.io`)에 대한 애플리케이션 및 서비스를 관리합니다.

## 인프라 아키텍처

- **Reverse Proxy**: Traefik (자동 SSL, 라우팅)
- **Container Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (GitOps)
- **Registry**: Docker Hub
- **SSL**: Let's Encrypt (자동 갱신)

## GitOps 운영 방식

이 프로젝트는 **GitOps** 방식으로 운영됩니다. 모든 인프라 변경은 Git을 통해 관리되며, GitHub Actions가 자동으로 배포를 수행합니다.

### GitOps 워크플로우

```
Code Change → Git Push → GitHub Actions → Docker Build → Deploy → Sync
```

### 배포 파이프라인

1. **코드 변경**: 개발자가 코드를 수정하고 커밋
2. **자동 빌드**: GitHub Actions가 Docker 이미지 빌드
3. **이미지 푸시**: Docker Hub에 이미지 업로드
4. **자동 배포**: 서버에서 새 이미지로 서비스 업데이트
5. **상태 동기화**: GitOps 동기화로 일관성 보장

### 환경별 배포 전략

#### 개발 환경 (develop 브랜치)
- **트리거**: `develop` 브랜치 푸시
- **이미지 태그**: `develop-<commit-sha>`
- **배포 프로필**: `docker compose --profile dev`
- **도메인**: `*.localhost` (HTTP only)

#### 프로덕션 환경 (main 브랜치)
- **트리거**: `main` 브랜치 푸시
- **이미지 태그**: `latest`, `<version>`
- **배포 프로필**: `docker compose --profile prod`
- **도메인**: `*.suho.io` (HTTPS with Let's Encrypt)

## 서버 배포 및 관리

### 1. 초기 서버 설정

새로운 서버에 인프라를 배포할 때:

```bash
# 1. Docker 네트워크 생성
docker network create web

# 2. 환경 변수 설정
cat > .env << EOF
DOMAIN=suho.io
LETSENCRYPT_EMAIL=your-email@example.com
TRAEFIK_AUTH=admin:$2y$10$...  # htpasswd로 생성
DOCKER_USERNAME=your-dockerhub-username
EOF

# 3. 저장소 클론
git clone https://github.com/your-username/suho.io.git
cd suho.io

# 4. 프로덕션 환경 배포
docker compose --profile prod up -d
```

### 2. 일상적인 운영

#### 서비스 상태 확인
```bash
# 모든 서비스 상태
docker compose --profile prod ps

# 특정 서비스 로그
docker compose logs -f <service-name>

# Traefik 대시보드 접근
# https://traefik.suho.io (basic auth 필요)
```

#### GitOps 기반 업데이트 배포

**자동 배포 (권장)**
```bash
# 1. 코드 변경 후 Git 푸시
git add .
git commit -m "feat: update service configuration"
git push origin main

# 2. GitHub Actions가 자동으로:
#    - Docker 이미지 빌드
#    - Docker Hub에 푸시  
#    - 서버에 자동 배포
#    - 서비스 헬스 체크

# 3. 배포 상태 확인
# GitHub Actions 탭에서 워크플로우 실행 상태 확인
```

**수동 배포 (긴급 상황용)**
```bash
# Git에서 최신 변경사항 가져오기
git pull origin main

# 서비스 재배포 (이미지 업데이트 포함)
docker compose --profile prod pull
docker compose --profile prod up -d

# 사용하지 않는 이미지 정리
docker image prune -f
```

#### GitOps 동기화
```bash
# 서버와 Git 상태 동기화 확인 (매시간 자동 실행)
# 수동 실행 시:
cd /path/to/repo
git fetch origin
git reset --hard origin/main
docker compose --profile prod up -d --force-recreate
```

#### 백업 및 복구
```bash
# 볼륨 백업 (데이터베이스 등)
docker run --rm -v <volume_name>:/source -v $(pwd):/backup ubuntu tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C /source .

# 볼륨 복구
docker run --rm -v <volume_name>:/target -v $(pwd):/backup ubuntu tar xzf /backup/backup-<date>.tar.gz -C /target
```

### 3. 새로운 애플리케이션 추가

#### 자동화된 방법 (권장)

```bash
# 1. GitHub Actions 워크플로우 생성
moon generate github-actions
# 프롬프트에 따라 앱 정보 입력

# 2. Docker Compose 서비스 설정 생성
moon generate docker-compose-service
# 프롬프트에 따라 서비스 정보 입력

# 3. server/compose.yml에 새 서비스 추가
# include 섹션에 새 서비스 파일 경로 추가

# 4. 변경사항 커밋 및 푸시 (GitOps 배포 트리거)
git add .
git commit -m "Add new app: <app-name>"
git push origin main

# 5. GitHub Actions에서 자동 배포 확인
# - 워크플로우 실행 상태: GitHub → Actions 탭
# - 배포 로그 확인: 각 워크플로우의 상세 로그
# - 서비스 상태 확인: 서버에서 docker compose ps
```

#### 수동 방법

1. **GitHub Actions 워크플로우 생성**
   - `.github/workflows/build-<app-name>.yml` 작성
   - 기존 워크플로우를 템플릿으로 사용

2. **Docker Compose 설정 생성**
   - `server/<app-name>/dev.yml` (개발 환경)
   - `server/<app-name>/prod.yml` (프로덕션 환경)

3. **Traefik 라우팅 설정**
   ```yaml
   labels:
     - "traefik.enable=true"
     - "traefik.http.routers.<app-name>.rule=Host(`<subdomain>.${DOMAIN}`)"
     - "traefik.http.routers.<app-name>.entrypoints=websecure"
     - "traefik.http.routers.<app-name>.tls=true"
     - "traefik.http.routers.<app-name>.tls.certresolver=letsencrypt"
   ```

4. **server/compose.yml 업데이트**
   ```yaml
   include:
     - path: ./<app-name>/dev.yml
     - path: ./<app-name>/prod.yml
   ```

### 4. GitHub Secrets 설정

Repository Settings → Secrets and variables → Actions에서 설정:

```
DOCKER_USERNAME      # Docker Hub 사용자명
DOCKER_PASSWORD      # Docker Hub 패스워드/토큰
DEPLOY_HOST         # 배포 서버 호스트명/IP
DEPLOY_USER         # SSH 사용자명
DEPLOY_SSH_KEY      # SSH 개인키 (base64 인코딩)
DEPLOY_PATH         # 서버의 저장소 경로 (예: /opt/suho.io)
DOMAIN              # 도메인 (suho.io)
LETSENCRYPT_EMAIL   # Let's Encrypt 이메일
TRAEFIK_AUTH        # Traefik 대시보드 Basic Auth
```

### 5. GitOps 모니터링 및 관리

#### GitHub Actions 모니터링
```bash
# 워크플로우 실행 상태 확인
# GitHub → Actions 탭에서 확인

# CLI로 워크플로우 상태 확인 (gh CLI 필요)
gh run list --limit 10
gh run view <run-id>

# 실패한 워크플로우 재실행
gh run rerun <run-id>
```

#### 배포 상태 추적
```bash
# 현재 실행 중인 이미지 태그 확인
docker compose --profile prod images

# 최신 배포된 커밋 확인
git log --oneline -1

# 서버와 Git 동기화 상태 확인
git status
git diff HEAD origin/main
```

#### GitOps 동기화 문제 해결
```bash
# 동기화 실패 시 수동 복구
git fetch origin
git reset --hard origin/main
docker compose --profile prod pull
docker compose --profile prod up -d --force-recreate

# 컨테이너 이미지와 Git 태그 불일치 해결
docker compose --profile prod down
docker image prune -a -f
docker compose --profile prod up -d
```

### 6. 모니터링 및 알림

#### 서비스 상태 모니터링
```bash
# 모든 컨테이너 상태 확인
docker compose --profile prod ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# 리소스 사용량 확인
docker stats

# 로그 실시간 모니터링
docker compose logs -f --tail=100
```

#### SSL 인증서 상태 확인
```bash
# 인증서 만료일 확인
echo | openssl s_client -servername suho.io -connect suho.io:443 2>/dev/null | openssl x509 -noout -dates
```

### 7. 트러블슈팅

#### GitOps 관련 문제들

1. **GitHub Actions 빌드 실패**
   ```bash
   # 워크플로우 로그 확인
   gh run view <run-id> --log
   
   # 로컬에서 빌드 테스트
   docker build -f apps/<app>/Dockerfile .
   
   # 의존성 문제 해결
   bun install
   moon run <app>:build
   ```

2. **배포 실패 (SSH 연결 문제)**
   ```bash
   # SSH 키 확인
   ssh -i /path/to/key user@server
   
   # GitHub Secrets의 SSH 키 재설정
   # DEPLOY_SSH_KEY 값 확인 및 업데이트
   
   # 서버 방화벽 확인
   sudo ufw status
   ```

3. **이미지 Pull 실패**
   ```bash
   # Docker Hub 로그인 상태 확인
   docker login
   
   # 이미지 수동 pull 테스트
   docker pull username/image:tag
   
   # 네트워크 연결 확인
   curl -I https://registry-1.docker.io/
   ```

#### 일반적인 인프라 문제들

1. **서비스가 시작되지 않는 경우**
   ```bash
   # 자세한 로그 확인
   docker compose logs <service-name>
   
   # 네트워크 연결 확인
   docker network ls
   docker network inspect web
   ```

2. **SSL 인증서 문제**
   ```bash
   # Traefik 로그 확인
   docker compose logs traefik
   
   # 인증서 재발급 강제
   docker compose exec traefik rm -rf /letsencrypt
   docker compose restart traefik
   ```

3. **도메인 라우팅 문제**
   ```bash
   # Traefik 대시보드에서 라우터 상태 확인
   # https://traefik.suho.io
   
   # DNS 설정 확인
   nslookup <subdomain>.suho.io
   ```

4. **GitOps 동기화 문제**
   ```bash
   # Git 상태와 서버 상태 불일치
   git status
   git diff HEAD origin/main
   
   # 강제 동기화
   git reset --hard origin/main
   docker compose --profile prod up -d --force-recreate
   ```

### 8. 보안 관리

- 정기적인 Docker 이미지 업데이트
- 시스템 패키지 업데이트
- SSH 키 교체 (필요시)
- Let's Encrypt 인증서 자동 갱신 확인
- 접근 로그 모니터링

### 9. 백업 전략

- **코드**: Git 저장소 (GitHub)
- **데이터**: Docker 볼륨 정기 백업
- **설정**: .env 파일 및 compose 설정 백업
- **인증서**: Let's Encrypt 볼륨 백업

## 긴급 대응

### 서비스 다운 시
1. 서비스 상태 확인: `docker compose ps`
2. 로그 확인: `docker compose logs <service>`
3. 재시작: `docker compose restart <service>`
4. 필요시 전체 재배포: `docker compose --profile prod up -d --force-recreate`

### 도메인 접근 불가 시
1. DNS 설정 확인
2. Traefik 상태 및 로그 확인
3. SSL 인증서 상태 확인
4. 네트워크 연결 확인