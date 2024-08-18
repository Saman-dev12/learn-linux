# Use the latest Ubuntu image as a base
FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Set the default command to bash
CMD [ "bash" ]
