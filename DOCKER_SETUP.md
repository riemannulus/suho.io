# Docker Compose Setup with Traefik

This repository uses a modular Docker Compose setup with Traefik as a reverse proxy. The setup supports both development and production environments using Docker Compose profiles and the `include` feature for better organization.

## Structure

```
compose.yml                  # Root compose file
server/
├── compose.yml             # Main server compose that includes all services
├── common/                 # Common resources
│   ├── networks.yml        # Network definitions
│   └── volumes.yml         # Volume definitions
├── traefik/                # Traefik service directory
│   ├── dev.yml             # Development profile (HTTP)
│   └── prod.yml            # Production profile (HTTPS + Let's Encrypt)
└── tools/                  # Tools application directory
    ├── dev.yml             # Development profile
    └── prod.yml            # Production profile
```

## Key Features

- **Modular Structure**: Services are organized in separate directories with profile-specific configurations
- **Fragment Composition**: Uses Docker Compose `include` feature for clean separation
- **Profile-based Deployment**: Separate dev/prod configurations
- **Development-friendly**: HTTP-only for local development, HTTPS with Let's Encrypt for production

## Prerequisites

1. Docker and Docker Compose installed
2. Create the external network:
   ```bash
   docker network create web
   ```

## Development Setup

For development, Traefik runs without Let's Encrypt certificates:

```bash
# Copy environment variables
cp .env.example .env

# Start services with dev profile
docker compose --profile dev up -d
```

Access your services:
- Tools app: https://tools.localhost
- Traefik dashboard: https://traefik.localhost (login: admin/admin)

## Production Setup

For production, Traefik automatically obtains Let's Encrypt certificates:

```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env and set:
# - DOMAIN=yourdomain.com
# - LETSENCRYPT_EMAIL=your-email@example.com
# - TRAEFIK_AUTH=<generated-auth-string>

# Generate Traefik auth (replace 'admin' with your username):
echo $(htpasswd -nB admin) | sed -e s/\\$/\\$\\$/g

# Start services with prod profile
docker compose --profile prod up -d
```

Access your services:
- Tools app: https://tools.yourdomain.com
- Traefik dashboard: https://traefik.yourdomain.com

## Managing Services

```bash
# View logs
docker compose logs -f traefik
docker compose logs -f tools

# Restart a service
docker compose restart tools

# Stop all services
docker compose --profile dev down
# or
docker compose --profile prod down

# Rebuild and restart a service
docker compose --profile dev up -d --build tools
```

## SSL Certificates

- **Development**: Uses Traefik's default self-signed certificates
- **Production**: Automatically obtains and renews Let's Encrypt certificates
- Certificates are stored in the `traefik-certificates` volume

## Adding New Services

To add a new service behind Traefik:

1. Add the service to `compose.yml`
2. Include appropriate labels for Traefik routing
3. Ensure the service is on the `web` network
4. Set the correct profile (`dev`, `prod`, or both)

Example:
```yaml
my-service:
  image: myapp:latest
  networks:
    - web
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.myservice.rule=Host(`myservice.localhost`)"
    - "traefik.http.routers.myservice.entrypoints=websecure"
    - "traefik.http.routers.myservice.tls=true"
    - "traefik.http.services.myservice.loadbalancer.server.port=8080"
  profiles:
    - dev
```