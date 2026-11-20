variable "vm_image_url" {
  description = "Ubuntu 22.04 qcow2"
  type        = string
  default     = "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
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

variable "ansible_ssh_key_path" {
  description = "Path to SSH public key"
  type        = string
  default     = "../.ssh/ansible_key.pub"
}