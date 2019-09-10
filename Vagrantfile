$install_python = <<SCRIPT
pkg install -y python36
SCRIPT

Vagrant.configure(2) do |config|
    config.vm.guest = :freebsd
    config.vm.box = "freebsd/FreeBSD-11.2-RELEASE"
    config.vm.base_mac = "D807A14E63B6"
    config.vm.network "private_network", ip: "192.168.100.100"
    config.vm.network "forwarded_port",
        guest: 8000,
        host: 8000
    config.vm.network "forwarded_port",
        guest: 9000,
        host: 9000
    config.vm.synced_folder ".",
        "/var/www/api.hikster.com/src",
        type: "nfs",
        id: "vagrant-root"
    config.vm.provision "shell", inline: $install_python
    config.vm.provision "ansible" do |ansible|
        ansible.playbook = "deploy/vagrant.yml"
        ansible.verbose = "vv"
    end
    config.vm.provider "virtualbox" do |vb|
        vb.memory = 2048
        vb.cpus = 2
        vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    end
    config.ssh.shell = "sh"
end
