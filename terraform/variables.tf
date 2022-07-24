# for the sake of displaying usage of variables I provide the deploy region
variable "region" {
  type = string
  default = "eu-west1"
  description = "Region to deploy instances into"
}

variable "region_zone" {
  type = string
  default = "eu-west1a"
  description = "Zone to deploy instances into"
}

variable "office_ips" {
    type = list(string)
    default = []
    description = "Used for SSH"
}