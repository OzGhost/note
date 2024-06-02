## Build docker image
_note_: source from another repo, need to adjust db connection info then package into a tar file
```
docker build -t mahphp:0.0.1 .
```

## Run the image
* Prepare sql file (can pick up in source) then name it `mah.sql`
* Execute `init.sh` script to bring up both db & app
