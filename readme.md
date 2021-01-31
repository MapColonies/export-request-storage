# Statuses Storage Service

A service that exposes a gateway to the export-request statuses storage. 

# Notes

When tagging if the DB schema has change since the last tag a migration must be created with the following steps:
1. manually increment the service version
1. create new empty postgres DB and set update default.json config to connect to it.
1. run ```npm run migration:run``` to build db schema up to the last migration.
1. run ```npm migration:create``` to generate new migration file.
1. commit changes to git.
1. run ```npm run release -- --release-as <version>``` to prevent double bumping and follow release instructions.

# Usage
1. Run `npm install `.
1. Run `npm run confd` to generate config file from confd
1. (optional) add `.env` file to change server port and swagger host name (see `.env.example`)
1. Run `npm start` - default port is 80.

If you would like to run as docker, consider the following steps:
1. Build the docker image by running `build.sh`. This will create a docker image named `export-storage` and tag `latest`.
2. Run the `docker_run.sh` script. Please note for default configuration as you might want to adjust it for your local needs.

# API Usage

## Create a new export-request status

new export-request status can be saved by sending POST request with the needed attributes as JSON in the request body to `/statuses`.

## Read a specific status

Existing export-request status can be retrieved by sending GET request to `/statuses/<taskId>`. *taskId* is the unique identifier of the status.

## Search all export-requests of a specific user

Existing export-requests which made by a specific user can be retrieved by sending GET to `/statuses/user/<userId>`. *userId* is the unique identifier of the user.

## Update existing status

Existing export-request statuses can be updated by sending PUT request with the updated fields as JSON in the request body to `/statuses/<taskId>`. *taskId* is the unique identifier of the status.

## Delete existing status

Existing status data can be deleted by sending POST request to `/statuses/delete`. This request expects of a request body that contains arrays of *taskIds* (UUID string) to delete.

## Search statuses by their expiration date

Existing statuses that expire before a specific date can be retrieved by making a GET request to `/statuses/expired/<date>`. Any status which its expiration date happens before *date* will be returned.
