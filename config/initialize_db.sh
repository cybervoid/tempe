#!/usr/bin/env bash
npx sequelize-cli model:generate --name Movie --attributes name:string,year:string,quality:string
npx sequelize-cli db:migrate --env "dev"