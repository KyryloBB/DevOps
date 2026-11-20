terraform {
  required_providers {
    virtualbox = {
      source  = "eran132/vbox"
      version = "2.1.1"
    }
  }
}

provider "virtualbox" {}

resource "virtualbox_hostonly_network" "mywebapp_net" {
  ipv4_address = "192.168.57.1"
  ipv4_netmask = "255.255.255.0"
  dhcp_enabled = false
}

resource "virtualbox_vm" "worker" {
  name   = "worker"
  image  = var.vm_image_url
  cpus   = var.vm_cpus
  memory = "${var.vm_memory}mib"
  status = "running"

  # Передача cloud-init конфігурації до VM
  user_data = templatefile("${path.module}/cloud-init-worker.yml", {
    ansible_ssh_key = file(pathexpand(var.ansible_ssh_key_path))
    worker_ip       = var.worker_ip
  })

  network_adapter {
    type = "nat"
  }

  network_adapter {
    type           = "hostonly"
    host_interface = virtualbox_hostonly_network.mywebapp_net.name
  }
}

resource "virtualbox_vm" "db" {

  name   = "db"
  image  = var.vm_image_url
  cpus   = var.vm_cpus
  memory = "${var.vm_memory}mib"
  status = "running"

  # Передача cloud-init конфігурації до VM
  user_data = templatefile("${path.module}/cloud-init-db.yml", {
    ansible_ssh_key = file(pathexpand(var.ansible_ssh_key_path))
    db_ip           = var.db_ip
  })

  network_adapter {
    type = "nat"
  }

  network_adapter {
    type           = "hostonly"
    host_interface = virtualbox_hostonly_network.mywebapp_net.name
  }
}