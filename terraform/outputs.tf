output "devops_exercise_eip_public_ip" {
    description = "Public Elastic IP"
    value = resource.aws_eip.devops_exercise_eip.public_ip
}