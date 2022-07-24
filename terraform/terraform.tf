terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.region
}

# use ami example for convenience
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

data "aws_vpc" "default_vpc" {
  default = true
}

# note: this will have a resource name of "this_name_prefix"
module "devops_exercise_sg_http" {
  source = "terraform-aws-modules/security-group/aws//modules/http-80"

  name        = "devops-exercise-sg-http"
  description = "Security group for web-server with HTTP ports open within VPC"
  vpc_id      = data.aws_vpc.default_vpc.id

  ingress_cidr_blocks = ["0.0.0.0/0"]

  tags = {
    "project" = "devops-exercise"
  }
}

module "devops_exercise_sg_ssh" {
  source = "terraform-aws-modules/security-group/aws//modules/ssh"

  name        = "devops-exercise-sg-ssh"
  description = "Security group for web-server with SSH ports open"
  vpc_id      = data.aws_vpc.default_vpc.id

  ingress_cidr_blocks = var.office_ips

  tags = {
    "project" = "devops-exercise"
  }
}

resource "aws_eip" "devops_exercise_eip" {
  instance = aws_instance.devops_exercise.id
  vpc      = true

  tags = {
    "project" = "devops-exercise"
  }
}

resource "aws_key_pair" "devops_exercise_kp" {
  key_name = "devops_exercise_kp"
  public_key = file("${path.module}/id_rsa.pub")
}

resource "aws_instance" "devops_exercise" {
  ami = data.aws_ami.ubuntu.id
  instance_type     = "t2.micro"
  user_data = file("${path.module}/startup.sh")
  vpc_security_group_ids = [
    module.devops_exercise_sg_http.security_group_id,
    module.devops_exercise_sg_ssh.security_group_id
  ]
  key_name = aws_key_pair.devops_exercise_kp.key_name

  tags = {
    "project" = "devops-exercise"
  }

  volume_tags = {
    "project" = "devops-exercise"
  }
}