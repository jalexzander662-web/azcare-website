FROM nginx:alpine

# Serve the static AZcare site
COPY . /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
