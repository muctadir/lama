# LAMA - LL

## Part 1: First-time setup
1. If you have don't have a TU/e laptop or you have already done this, skip to Part 2
2. Windows+R and type `powershell` and hit Ctrl+Shift+Enter and click yes
3. Enter `set-executionpolicy remotesigned` in the powershell
4. Choose [Y]es and close powershell

## Part 2: Starting Up
1. Start docker
2. Open powershell from vs code (or powershell in the project directory)
3. Type `start` and press tab once on Linux, or twice on Windows, then hit enter
4. Choose based on operating system (this is a step to make sure you ran the correct script in the last step)
5. Choose the type of deployment
6. See possible errors in Part 4

## Part 2.1: Initializing Database
Only needs to be done the first time
1. In the vs code powershell run `docker exec lama-flask flask db-opt init`
2. Optionally, also run `docker exec lama-flask flask db-opt fill` to fill the database with sample data

## Part 3: Closing Down
1. Open powershell from vs code (or powershell in the project directory)
2. Type `stop` and press tab once on Linux, or twice on Windows, then hit enter
3. Choose based on operating system (this is a step to make sure you ran the correct script in the last step)

## Part 4: Known Errors
`Error response from daemon: i/o timeout`:
Reason 1: Port 80 is in use already (by another docker container)
Fix: Close the app (Part 3), delete the container and retry Part 2
Reason 2: Took too long to boot.
Fix: Close the app (Part 3). Starting up is faster the second time so retry. If it's still too slow, see other possible reasons, or give up.

---

### Notes:
1. The phpMyAdmin will always runs on port 81
2. The app should work with many different kinds of drivers and dialects if you do not want to use MySQL
    (see [here](https://docs.sqlalchemy.org/en/14/core/engines.html))
3. Environment variables to customize database URI are in backend\.env
4. Forcibly closing docker will cause the app to boot automatically the next time docker opens (in case of system failure).