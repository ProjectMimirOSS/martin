FROM node:12.16.1-alpine3.9 as build
WORKDIR /app
ARG PROJECT_TITLE="PROJECT MARTIN"
ARG BACKEND_IP="localhost"
ENV REACT_APP_BACKEND_IP $BACKEND_IP
ENV REACT_APP_PROJECT_TITLE $PROJECT_TITLE
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . /app
RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.17.8-alpine
COPY --from=build /app/build /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



# POSTGRES_PORT=5444 BACKEND_PORT=5052 FRONTEND_PORT=5051 docker-compose up
