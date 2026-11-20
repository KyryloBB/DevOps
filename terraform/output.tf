output "worker_ip" {
  description = "Host-Only IP address"
  value       = "192.168.57.47"
}

output "db_ip" {
  description = "Host-Only IP address"
  value       = "192.168.57.48"
}

output "ssh_command" {
  description = "SSH connection command"
  value       = "ssh ansible@{vm_ip}"
}