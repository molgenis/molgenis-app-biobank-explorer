FROM nginx:1.16.0
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/default.conf 
RUN mkdir -p /usr/share/nginx/html/plugin/app/molgenis-app-biobank-explorer/js/
RUN mkdir -p /usr/share/nginx/html/plugin/app/molgenis-app-biobank-explorer/css/
RUN mkdir -p /usr/share/nginx/html/plugin/app/molgenis-app-biobank-explorer/img/
COPY docker/config/default.conf.template /etc/nginx/conf.d/
COPY docker/entry.sh /
RUN chmod +x entry.sh
COPY dist/js/ /usr/share/nginx/html/plugin/app/molgenis-app-biobank-explorer/js/
COPY dist/css/ /usr/share/nginx/html/plugin/app/molgenis-app-biobank-explorer/css/
COPY dist/img/ /usr/share/nginx/html/plugin/app/molgenis-app-biobank-explorer/img/
COPY dist/index.html /usr/share/nginx/html/ 
ENTRYPOINT ["/entry.sh"]
CMD ["nginx", "-g", "daemon off;"]