# MongoDB Tool

Web based tool for the purpose of restoring mongodb dumps.

## How to run the application

```shell
npm i
docker-compose up
```

Access http://localhost:8080/

## How application works

When application loads, it will list all available DB dumps for user to pick which one he needs to restore. When the restore button is clicked, it will create a job document in the backup_info database and emit the restore event with job related info. Backup restore listener will pick it up and start the backup process.

First it will drop the existing database and restore the locations database with the new database dump.

In the frontend, user cannot restore any other backups until current job is completed. Frontend will continue to poll the status of the current job until the status is completed or error. Even if the webpage is refreshed, if the last job is still active, user cannot restore any other backups until it is completed.

Frontend always shows the info of the last job and will update when a restore is finished.
