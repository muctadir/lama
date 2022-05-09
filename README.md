![LaMa logo](/frontend/assets/lama_nobg.png)

[![Bugs](https://sonar.henkemans.be/api/project_badges/measure?project=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV&metric=bugs&token=19efa36756619fc773b5a943cd8df83eb5728056)](https://sonar.henkemans.be/dashboard?id=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV)
[![Code Smells](https://sonar.henkemans.be/api/project_badges/measure?project=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV&metric=code_smells&token=19efa36756619fc773b5a943cd8df83eb5728056)](https://sonar.henkemans.be/dashboard?id=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV)
[![Duplicated Lines (%)](https://sonar.henkemans.be/api/project_badges/measure?project=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV&metric=duplicated_lines_density&token=19efa36756619fc773b5a943cd8df83eb5728056)](https://sonar.henkemans.be/dashboard?id=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV)
[![Maintainability Rating](https://sonar.henkemans.be/api/project_badges/measure?project=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV&metric=sqale_rating&token=19efa36756619fc773b5a943cd8df83eb5728056)](https://sonar.henkemans.be/dashboard?id=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV)
[![Reliability Rating](https://sonar.henkemans.be/api/project_badges/measure?project=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV&metric=reliability_rating&token=19efa36756619fc773b5a943cd8df83eb5728056)](https://sonar.henkemans.be/dashboard?id=aserebre_SEP-Project_AYCqEUwIV9l8Wxj9tctV)

---
# Setup
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
`Error response from daemon: i/o timeout`:<br />
Reason 1: Port 80 is in use already (by another docker container) <br />
Fix: Close the app (Part 3), delete the container and retry Part 2 <br />

Reason 2: Took too long to boot. <br />
Fix: Close the app (Part 3). Starting up is faster the second time so retry. If it's still too slow, see other possible reasons, or give up.

---

### Notes:
1. The phpMyAdmin will always runs on port 81
2. The app should work with many different kinds of drivers and dialects if you do not want to use MySQL
    (see [here](https://docs.sqlalchemy.org/en/14/core/engines.html))
3. Environment variables to customize database URI are in backend\.env
4. Forcibly closing docker will cause the app to boot automatically the next time docker opens (in case of system failure).