# pull mysql community

FROM container-registry.oracle.com/mysql/community-server

# copy the sql file to the container

COPY ./nona.sql /docker-entrypoint-initdb.d/

# expose port 3306

EXPOSE 3306

# run the container

# CMD ["mysqld"]




