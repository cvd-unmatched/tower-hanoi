# Tower of Hanoi Puzzle

A modern, interactive Tower of Hanoi puzzle game built with HTML5, CSS3, and JavaScript. Features two game modes and drag-and-drop functionality.

## 🎮 Game Modes

### Classic Mode
- All 5 disks start on the left tower in correct order
- Target: Move all disks to the right tower in order (1 on top, 5 on bottom)

### Random Mode
- Disks are randomly distributed across all 3 towers
- A random tower is selected as the target and highlighted
- Target: Move all disks to the highlighted target tower in order

## 🚀 Quick Start with Docker

### Option 1: Pull and Run (Recommended)
```bash
# Pull the latest image
docker pull ghcr.io/cvd-unmatched/hanoi:latest

# Run the container
docker run -d --name tower-of-hanoi -p 8080:80 ghcr.io/cvd-unmatched/hanoi:latest

# Open your browser to http://localhost:8080
```

### Option 2: Using Docker Compose
```bash
# Clone the repository
git clone <your-repo-url>
cd hanoy

# Run with docker-compose
docker-compose up -d

# Open your browser to http://localhost:8080
```

### Option 3: Using Makefile
```bash
# Clone the repository
git clone <your-repo-url>
cd hanoy

# Pull and run
make pull
make run

# Or use docker-compose
make compose-up
```

## 🛠️ Local Development

### Prerequisites
- Docker installed on your system

### Build Locally
```bash
# Build the Docker image
make build

# Run locally
make run

# Stop the container
make stop

# Clean up
make clean
```

## 📦 Docker Image Details

- **Base Image**: nginx:alpine
- **Registry**: GitHub Container Registry (ghcr.io)
- **Image**: `ghcr.io/cvd-unmatched/hanoi`
- **Port**: 80 (internal), 8080 (external)
- **Size**: ~20MB (alpine-based)

## 🔧 Available Make Commands

```bash
make help          # Show available commands
make build         # Build Docker image locally
make run           # Run container locally
make stop          # Stop running container
make clean         # Remove local image
make pull          # Pull latest image from registry
make push          # Push image to registry (requires login)
make compose-up    # Start with docker-compose
make compose-down  # Stop with docker-compose
make logs          # View container logs
```

## 🌐 Access the Application

Once running, open your web browser and navigate to:
- **Local**: http://localhost:8080
- **Container**: http://localhost:80 (if accessing from within Docker network)

## 🎯 Game Features

- **Drag & Drop**: Intuitive disk movement
- **Visual Feedback**: Target tower highlighting
- **Move Counter**: Track your progress
- **Timer**: Measure your solving time
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Numbered disks for color-blind users

## 📱 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Docker Image**: `ghcr.io/cvd-unmatched/hanoi:latest`
- **GitHub Repository**: [Your Repo URL]
- **Live Demo**: [If deployed somewhere]
