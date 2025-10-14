# TrendUp Production Build Script for Windows
# Run this on your LOCAL machine before deploying to EC2

Write-Host "🚀 Building TrendUp for Production (EC2: 3.25.92.137)" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if in correct directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "❌ Error: Run this from the trendup-new root directory" -ForegroundColor Red
    exit 1
}

# Build frontend
Write-Host ""
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
Set-Location frontend

# Create .env.production if it doesn't exist
if (-not (Test-Path ".env.production")) {
    Write-Host "⚠️  Creating .env.production file..." -ForegroundColor Yellow
    @"
VITE_API_URL=http://3.25.92.137/api/v1
VITE_WEB3_PROJECT_ID=a65bc026af82f217afeb8f7543a83113
"@ | Out-File -FilePath ".env.production" -Encoding UTF8
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Build
npm run build

# Check if dist folder was created
if (Test-Path "dist") {
    Write-Host "✅ Frontend build successful!" -ForegroundColor Green
    Write-Host "   Output: frontend/dist" -ForegroundColor Gray
    
    $distSize = (Get-ChildItem -Recurse dist | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Size: $([math]::Round($distSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Build Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Commit: git add . && git commit -m 'Production build' && git push" -ForegroundColor White
Write-Host "2. On EC2: cd trendup-new && git pull" -ForegroundColor White
Write-Host "3. On EC2: docker-compose -f docker-compose.prod.yml up -d --build" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Your app will be at: http://3.25.92.137" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://3.25.92.137:3001" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

