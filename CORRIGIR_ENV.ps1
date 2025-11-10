# Script para corrigir o arquivo .env com encoding correto

Write-Host "Corrigindo arquivo .env..." -ForegroundColor Yellow

# Verificar se o arquivo existe
if (Test-Path .env) {
    Write-Host "Arquivo .env encontrado. Renomeando para .env.backup..." -ForegroundColor Cyan
    Rename-Item .env .env.backup -ErrorAction SilentlyContinue
}

# Criar novo arquivo .env com encoding UTF8 (sem BOM)
Write-Host "Criando novo arquivo .env com encoding correto..." -ForegroundColor Cyan

$content = @"
# Supabase Configuration
# Este arquivo é usado pelo Supabase CLI
# Não commite este arquivo no Git (já está no .gitignore)

# Project Reference ID (obtido do Dashboard do Supabase)
# PROJECT_ID=ldhxfiyjopesopqiwxyk

# Database Password (opcional - deixe vazio se não souber)
# DB_PASSWORD=
"@

# Criar arquivo com encoding UTF8 sem BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PWD\.env", $content, $utf8NoBom)

Write-Host "Arquivo .env criado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Agora tente novamente:" -ForegroundColor Yellow
Write-Host "  supabase link --project-ref ldhxfiyjopesopqiwxyk" -ForegroundColor Cyan

