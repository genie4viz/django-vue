# Project Readme

## Development

### Setting Up a Development Environment

The development environment is designed to work on a Unix-based OS, as it
requires NFS for the shared filesystem. That means either Linux or MacOS.

Before setting up your development environment, you need to make sure the
following is installed on your workstation:

- VirtualBox (https://www.virtualbox.org)
- Vagrant (https://www.vagrantup.com)
- Ansible (https://www.ansible.com)

Once the pre-requisites are installed, a development environment can be
created by running the following command:

    vagrant up

### Running the Development Server

There are two parts to the development server, the API/back-end, and the
front-end. To start the back-end, you must first login to vagrant instance
by running the following command:

    vagrant ssh

The first time you use the development instance, you must change the file
permissions on the public directory. This only needs to be done once, unless
you re-create the development instance. Permissions are changed by running
the following command:

    sudo chown -R vagrant /var/www/api.hikster.com/public

To prepare the API development environment, run the following commands:

    source /var/www/api.hikster.com/env/bin/activate
    export DJANGO_SETTINGS_MODULE=hikster.settings.vagrant_api

If you haven't done so already, you will probably want to create an admin user:

    python /var/www/api.hikster.com/src/manage.py createsuperuser

You now are ready to start the API development server:

    python /var/www/api.hikster.com/src/manage.py runserver 0.0.0.0:9000

On your local workstation, you can access the API development server at the
following URL:

    http://localhost:9000/

To start the front-end development server, you need to run the following
commands:

    source /var/www/api.hikster.com/env/bin/activate
    export DJANGO_SETTINGS_MODULE=hikster.settings.vagrant
    cd /var/www/api.hikster.com/src
    python /var/www/api.hikster.com/src/manage.py runserver 0.0.0.0:8000

On your local workstation, you can access the front-end development server at
the following URL:

    http://localhost:8000/

### Generating the Translation Files

To generate translation

    python manage.py makemessages \
        --locale=en \
        --locale=fr \
        --ignore=deploy/* \
        --ignore=deps/* \
        --ignore=js/* \
        --ignore=libs/* \
        --ignore=node_modules/* \
        --ignore=scss/*
    
    python manage.py compilemessages

### Deploying to the Development Server

Run the Following Command for API

    ansible-playbook -i deploy/inventory/dev deploy/dev.yml
    
    
Run the Following Command for frontend/website

    ansible-playbook -i deploy/inventory/dev deploy/dev_website.yml

## Production

### Deploying to the Production Server

To deploy to production:

    ansible-playbook -i deploy/inventory/prod deploy/prod.yml
