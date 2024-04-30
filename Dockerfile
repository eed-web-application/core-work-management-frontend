FROM node:16-alpine as builder

ARG MODE=production
ENV MODE $MODE

ARG API_ENDPOINT
ENV API_ENDPOINT $API_ENDPOINT

COPY . ./app
WORKDIR /app

RUN --mount=type=cache,id=npm,target=/npm/store npm install --frozen-lockfile

RUN npm run build

FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]