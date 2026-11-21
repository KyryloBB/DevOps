terraform {
  required_providers {
    libvirt = {
      source  = "dmacvicar/libvirt"
      version = "0.8.1"
    }
  }
}

provider "libvirt" {
  uri = "qemu:///system"
}

resource "libvirt_volume" "ubuntu_base" {
  name   = "ubuntu-22.04-base.qcow2"
  pool   = "default"
  source = var.vm_image_url
  format = "qcow2"
}

resource "libvirt_volume" "worker_disk" {
  name           = "worker.qcow2"
  pool           = "default"
  base_volume_id = libvirt_volume.ubuntu_base.id
  size           = 10737418240 # 10 ГБ
}

resource "libvirt_volume" "db_disk" {
  name           = "db.qcow2"
  pool           = "default"
  base_volume_id = libvirt_volume.ubuntu_base.id
  size           = 10737418240 # 10 ГБ
}

# Передача cloud-init
resource "libvirt_cloudinit_disk" "common_init" {
  name = "common-init.iso"
  pool = "default"
  user_data = templatefile("${path.module}/cloud-init.yml", {
    ansible_ssh_key = file(pathexpand(var.ansible_ssh_key_path))
  })
}

resource "libvirt_domain" "worker" {
  name   = "worker"
  memory = var.vm_memory
  vcpu   = var.vm_cpus

  cloudinit = libvirt_cloudinit_disk.common_init.id

  disk {
    volume_id = libvirt_volume.worker_disk.id
  }

  network_interface {
    network_name = "default"
    addresses    = ["192.168.122.10"]
  }

  console {
    type        = "pty"
    target_port = "0"
    target_type = "serial"
  }
}

resource "libvirt_domain" "db" {
  name   = "db"
  memory = var.vm_memory
  vcpu   = var.vm_cpus

  cloudinit = libvirt_cloudinit_disk.common_init.id

  disk {
    volume_id = libvirt_volume.db_disk.id
  }

  network_interface {
    network_name = "default"
    addresses    = ["192.168.122.20"]
  }

  console {
    type        = "pty"
    target_port = "0"
    target_type = "serial"
  }
}