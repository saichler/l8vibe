# Layer 8 Vibe

**Professionally Vibe with Layer 8 to create enterprise grade applications.**

## Overview

Layer 8 Vibe is a cutting-edge enterprise application platform that combines distributed systems architecture with AI-powered project management capabilities. Built on Go's robust ecosystem, it provides a scalable foundation for building modern applications with integrated Anthropic AI services.

## Features

### Core Platform
- **Distributed Architecture**: Built on Layer 8 overlay network for scalable, resilient applications
- **Web Server Framework**: RESTful API server with authentication and SSL support
- **Service-Oriented Design**: Modular services with distributed caching and health monitoring
- **Virtual Network Interface**: Advanced networking capabilities with connection management

### AI Integration
- **Anthropic AI Client**: Direct integration with Claude AI services
- **Project Management**: AI-powered project assistance and automation
- **Message Processing**: Intelligent conversation handling and context management

### Enterprise Features
- **Multi-User Support**: User-based project isolation and management
- **Data Persistence**: Protocol buffer serialization with file-based storage
- **Health Monitoring**: Built-in health checks and system monitoring
- **Kubernetes Ready**: Container orchestration support with K8s configurations

## Architecture

```
Layer 8 Vibe Platform
├── Web Server (REST API)
├── Project Service (AI Integration)
├── Virtual Network Interface
├── Distributed Cache
├── Health Monitoring
└── Anthropic AI Client
```

## Quick Start

### Prerequisites
- Go 1.19+
- Layer 8 dependencies
- Anthropic API access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saichler/l8vibe.git
cd l8vibe
```

2. Install dependencies:
```bash
cd go
go mod tidy
```

3. Configure environment:
```bash
export ANTHROPIC_API_KEY=your_api_key
export HOSTNAME=your_hostname
```

4. Start the web server:
```bash
go run l8vibe/websvr/main.go
```

5. Start the virtual network:
```bash
go run l8vibe/vnet/main.go
```

## Services

### Web Server
- **Port**: Configurable (default enterprise standard)
- **Authentication**: Optional SSL/TLS support
- **API**: RESTful endpoints for project management

### Project Service
- **AI Integration**: Direct Claude AI communication
- **Data Management**: Protocol buffer persistence
- **Multi-tenancy**: User-based project isolation

### Virtual Network
- **Overlay Network**: Layer 8 distributed networking
- **Service Discovery**: Automatic service registration
- **Health Checks**: Continuous system monitoring

## Configuration

Key configuration constants:
- `VNET_PORT`: Virtual network communication port
- `WEBSITE_PORT`: Web server listening port
- `WEBSITE_CERT`: SSL certificate configuration
- `WEBSITE_PREFIX`: API endpoint prefix

## Data Storage

Projects are stored in `/data/{user}/{project}.dat` using Protocol Buffer serialization for optimal performance and cross-platform compatibility.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the terms found in the LICENSE file.

## Enterprise Support

For enterprise deployments, consulting, and custom development, contact the Layer 8 team.
