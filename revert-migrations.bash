#!/usr/bin/env bash
{
  echo 'Reverting migrations...'
  echo 'Reverting Necessity migration...'
  ./node_modules/.bin/ts-node ./node_modules/typeorm/cli.js migration:revert
  echo 'Reverting NecessityType migration...'
  ./node_modules/.bin/ts-node ./node_modules/typeorm/cli.js migration:revert
  echo 'Reverting Category migration...'
  ./node_modules/.bin/ts-node ./node_modules/typeorm/cli.js migration:revert
  echo 'Reverting User migration...'
  ./node_modules/.bin/ts-node ./node_modules/typeorm/cli.js migration:revert
  echo 'Checking for more migrations to revert...'
  ./node_modules/.bin/ts-node ./node_modules/typeorm/cli.js migration:revert
} || {
  echo 'There was an error reverting the migrations'
  set -e
}
