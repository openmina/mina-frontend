# base image
FROM node:18 AS BUILD_IMAGE

# set working directory
WORKDIR /app

# install angular cli
RUN npm install -g @angular/cli

# clone & install deps for repo
ARG branch=local
ARG node_explorer_git="https://github.com/name-placeholder/mina-frontend"
RUN git clone ${node_explorer_git} && \
    cd mina-frontend && \
    git checkout ${branch} && \
    npm install

# change dir to angular app
WORKDIR /app/tezedge-explorer

# buid app
RUN ng build --configuration production --output-path=/dist

# remove development dependencies
RUN npm prune --production

################
# Run in NGINX #
################
FROM nginx:alpine
COPY --from=BUILD_IMAGE /app/dist/mina-frontend /usr/share/nginx/html

ARG commit=local
ENV COMMIT=$commit

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

# Example of how to run
# docker run --env ENV='' -p 8080:80 mina-frontend:latest
