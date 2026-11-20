output "worker_ip" {
  value = libvirt_domain.worker.network_interface[0].addresses[0]
}

output "db_ip" {
  value = libvirt_domain.db.network_interface[0].addresses[0]
}

output "ssh_command" {
  description = "SSH connection command"
  value       = "ssh ansible@{vm_ip}"
}