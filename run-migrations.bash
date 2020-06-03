#!/usr/bin/env bash
{
  echo 'Running migrations...'
  ./node_modules/.bin/ts-node ./node_modules/typeorm/cli.js migration:run
} || {
  echo 'Hubo un error al correr las migraciones'
  set -e
}
