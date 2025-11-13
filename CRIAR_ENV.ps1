# Script para criar arquivo .env com as configurações do projeto

$envContent = @"
# Supabase Configuration
VITE_SUPABASE_URL=https://ldhxfiyjopesopqiwxyk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkaHhmaXlqb3Blc29wcWl3eHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDA1NjQsImV4cCI6MjA3Njg3NjU2NH0.BKb6XMECfSvBcdfnhe3hqOwF13O6haiiFAnfuXg_a3s

# PerfectPay Configuration
VITE_PERFECTPAY_PRODUCT_ID=PPLQQNQO7
VITE_PERFECTPAY_CHECKOUT_URL=https://go.perfectpay.com.br/PPU38CQ332U
VITE_PERFECTPAY_API_URL=https://app.perfectpay.com.br

# Application URL (for redirects)
VITE_APP_URL=http://localhost:5173
"@

# Remove arquivo existente se houver
if (Test-Path ".env") {
    Remove-Item ".env" -Force
    Write-Host "[INFO] Arquivo .env antigo removido"
}

# Cria novo arquivo .env
[System.IO.File]::WriteAllText("$PWD\.env", $envContent, [System.Text.Encoding]::UTF8)

Write-Host "[OK] Arquivo .env criado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Agora você pode iniciar o servidor de desenvolvimento:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Cyan

