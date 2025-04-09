# Prod Deploy Frontend

## Table of Contents
1. AWS S3 Setup
2. Setting Up Project Locally
3. Dockerization
4. CI/CD
5. Terraform Architecture
6. Kubeadm Setup
7. Prometheus and Grafana Setup
8. Backup

## AWS S3 Setup

1. Go to AWS Console and search for S3.
2. Create a bucket.
3. Set "Block all public access" to off state.
4. Enable ACL.
5. Enable versioning.
6. Set bucket policy:
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::imgdevbucket123/uploads/*"
            }
        ]
    }
    ```

## Setting Up Project Locally

1. Clone the backend and frontend repositories:
    ```bash
    git clone https://github.com/hjain2003/Backend_Devops.git
    git clone https://github.com/hjain2003/Frontend_Devops.git
    ```
2. Run `npm install` in both the server and client folders.
3. In the server folder, create a `.env` file and add:
    ```env
    AWS_ACCESS_KEY_ID=<your-access-key-id>
    AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
    AWS_REGION=<your-region>
    BUCKET_NAME=<your-bucket-name>
    ```
4. Start the server and React app:
    ```bash
    cd server
    node app.js
    cd ../client
    npm start
    ```
    <b>server:</b> localhost:5000 <br/>
    <b>client:</b> localhost:3000
## Dockerization
Have already built the docker images and pushed them on dockerHub. In case you want to build yours, follow the below steps:
1. Build the Docker images:
    ```bash
    docker build -t <your-backend-image-name> ./server
    docker build -t <your-frontend-image-name> ./client
    ```
2. Login to Docker Hub:
    ```bash
    docker login
    ```
3. Push the Docker images:
    ```bash
    docker push <your-backend-image-name>
    docker push <your-frontend-image-name>
    ```

## CI/CD

1. Check the `.github` folder and find `/workflows` to see the CI/CD jobs.
2. Add Docker Hub secrets in GitHub:
    - Go to your repository settings.
    - Navigate to "Secrets and variables" > "Actions".
    - Add secrets for `DOCKER_USERNAME` and `DOCKER_PASSWORD`.

## Terraform Architecture

1. Create a Terraform server in AWS or run Terraform locally.
2. Check out the `terraform` folder in the repository.
3. The Terraform script will create:
    - VPC
    - IGW attached to VPC
    - Public subnet
    - Private subnet
    - NAT Gateway attached to VPC and Elastic IP
    - Route table for IGW
    - Route table for NAT
    - Route table association for public subnet
    - Route table association for private subnet
    - Security groups configuration
    - EC2 instances for public and private subnets

This will create two EC2 servers in AWS for your frontend and backend in public and private subnets respectively.

## Kubeadm Setup

1. Create a master server with at least 2GB RAM on AWS (e.g., t3.small).
2. Set up frontend and backend as worker nodes.
3. Follow the steps here: <a href="https://github.com/hjain2003/Kubeadm-Installation-Guide">Kubeadm Installation Guide</a>
4. On the master machine, copy the deployment and service manifest files for frontend and backend as given in this repo.
5. Apply the files:
    ```bash
    kubectl apply -f frontend-deploy.yml
    kubectl apply -f frontend-service.yml
    kubectl apply -f backend-deploy.yml
    kubectl apply -f backend-service.yml
    ```
6. Check the deployments, pods, and services:
    ```bash
    kubectl get deployments
    kubectl get pods
    kubectl get services
    ```

## Prometheus and Grafana Setup

1. Create two instances:
    - One for Prometheus
    - One for Grafana
2. Clone the repository:
    ```bash
    git clone https://github.com/hjain2003/prometheus-monitoring
    ```
3. Run the installation scripts:
    ```bash
    ./install-Prometheus.sh #inside Promoetheus instance
    ./install-node-exporter.sh  # To be installed on frontend and backend servers
    ./install-Grafana.sh #inside Grafana instance
    ```
4. Check Prometheus on: `http://<public-ip-of-instance>:9090`
    - Edit the `prometheus.yml` file and add targets for Node Exporter servers:
        ```yaml
        - targets: ['<frontend_public_ip>:9100']
        - targets: ['<backend_public_ip>:9100']
        ```
5. Check Node Exporter on: `http://<public-ip-of-instance>:9100`
6. Check Grafana on: `http://<public-ip-of-instance>:3000`
    - Inside Grafana, add a data source for the Prometheus server.

## Backup

1. Go to AWS Backup > Backup Plans > Create Backup Plan.
2. Build a new plan > Schedule your backup > Create a vault (if not already created) > Create plan.
3. Assign resources for backup.

---
