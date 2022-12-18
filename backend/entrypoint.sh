#!/usr/bin/env bash
flask db-safe init
flask db migrate
flask db upgrade
flask db-safe add-super-admin
flask run --host=0.0.0.0
