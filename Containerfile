# Imagen del frontend de PAMCE para Podman (también la lee Buildah y Docker).
FROM docker.io/library/node:20-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# URL del backend que queda incluida en el build:
# podman build --build-arg VITE_API_URL=https://api.ejemplo.com -t pamce-frontend .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# nginx sin privilegios: corre con un usuario normal y escucha en el 8080, así
# funciona con Podman sin root (un usuario normal no puede abrir puertos < 1024)
FROM docker.io/nginxinc/nginx-unprivileged:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
