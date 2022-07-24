#!/usr/bin/env bash

cd terraform

PLANFILE="plans/plan-$(date +%s).tfplan"
terraform plan -var-file=vars.tfvars -out "${PLANFILE}"

cd ../

echo -e "\n\nbash scripts/tfApply.sh ${PLANFILE}"