#!/usr/bin/env bash
echo '---initDB---' &&
npx ubcli initDB -p admin -drop -create &&  # -dba postgres -dbaPwd postgres # for postgres
echo '---generateDDL---' &&
npx ubcli generateDDL -autorun &&
echo '---initialize---' &&
npx ubcli initialize -u admin -p admin
