#!/usr/bin/env bash

cd terraform

PLANFILE=$1

terraform apply "${PLANFILE}"