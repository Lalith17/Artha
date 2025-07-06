# 🐳 Docker Installation and Setup Guide

## Step 1: Install Docker Desktop

### For Windows 10/11:

1. **Download Docker Desktop**:

   - Go to: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - Download the installer

2. **Install Docker Desktop**:

   - Run the downloaded installer
   - Follow the installation wizard
   - Enable WSL 2 when prompted (recommended)
   - Restart your computer when installation completes

3. **Start Docker Desktop**:

   - Launch Docker Desktop from Start menu
   - Wait for Docker to start (you'll see a green icon in system tray)

4. **Verify Installation**:
   ```powershell
   docker --version
   docker-compose --version
   ```

## Step 2: Deploy Personal Finance Visualizer

Once Docker is installed and running:

### Option A: Quick Start (Recommended)

```powershell
# Navigate to project directory
cd c:\Users\mslal\finance_manager

# Run the deployment script
.\docker-deploy.ps1
```

### Option B: Manual Commands

```powershell
# Build and start production
docker-compose up --build -d

# Or for development with hot reload
docker-compose -f docker-compose.dev.yml up --build -d
```

## Step 3: Access Your Application

After deployment:

- **App**: http://localhost:3000
- **Database Admin**: http://localhost:8081 (admin/password)

## Alternative: Install Docker via Chocolatey

If you have Chocolatey package manager:

```powershell
# Install Docker Desktop
choco install docker-desktop

# Restart PowerShell and verify
docker --version
```

## Alternative: Install Docker via Winget

If you have Windows Package Manager:

```powershell
# Install Docker Desktop
winget install Docker.DockerDesktop

# Restart PowerShell and verify
docker --version
```

## System Requirements

- **Windows 10/11** (64-bit)
- **4GB RAM** minimum (8GB recommended)
- **WSL 2** enabled (for better performance)
- **Hyper-V** or **WSL 2** backend

## Troubleshooting

### Docker not starting:

- Ensure virtualization is enabled in BIOS
- Check if Hyper-V is enabled
- Try switching to WSL 2 backend

### Permission issues:

- Run PowerShell as Administrator
- Add your user to "docker-users" group

### WSL 2 issues:

```powershell
# Enable WSL 2
wsl --install
wsl --set-default-version 2
```

## Next Steps

After Docker is installed:

1. **Test the installation**: `docker run hello-world`
2. **Deploy the app**: Run `.\docker-deploy.ps1`
3. **Access the app**: Open http://localhost:3000
4. **Manage database**: Open http://localhost:8081

## Docker Learning Resources

- [Docker Desktop Documentation](https://docs.docker.com/desktop/)
- [Docker Getting Started](https://docs.docker.com/get-started/)
- [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)

---

**Note**: Docker Desktop requires a license for commercial use. For personal use and small businesses, it's free.
