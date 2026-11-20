variable "vm_image_url" {
  description = "Ubuntu 22.04 VirtualBox Vagrant box"
  type        = string
  default     = "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64-vagrant.box"
}

variable "vm_cpus" {
  description = "Number of virtual CPUs"
  type        = number
  default     = 2
}

variable "vm_memory" {
  description = "RAM in MiB"
  type        = number
  default     = 1024
}

variable "worker_ip" {
  description = "Static Host-Only IP address"
  type        = string
  default     = "192.168.57.47"
}

variable "db_ip" {
  description = "Static Host-Only IP address"
  type        = string
  default     = "192.168.57.48"
}

variable "ansible_ssh_key_path" {
  description = "Path to SSH public key"
  type        = string
  default     = "../ansible_key.pub"
}