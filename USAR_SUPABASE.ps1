# Script para usar o Supabase CLI do caminho específico

$supabasePath = "C:\Gaveta 2\Projetos\Supa\supabase.exe"

# Verificar se o arquivo existe
if (Test-Path $supabasePath) {
    Write-Host "Supabase CLI encontrado em: $supabasePath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Comandos disponíveis:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Login no Supabase:" -ForegroundColor Cyan
    Write-Host "   & `"$supabasePath`" login" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Link com projeto:" -ForegroundColor Cyan
    Write-Host "   & `"$supabasePath`" link --project-ref ldhxfiyjopesopqiwxyk" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Deploy da função:" -ForegroundColor Cyan
    Write-Host "   & `"$supabasePath`" functions deploy perfectpay-webhook" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Ver logs:" -ForegroundColor Cyan
    Write-Host "   & `"$supabasePath`" functions logs perfectpay-webhook --tail" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ou adicione ao PATH para usar 'supabase' diretamente:" -ForegroundColor Yellow
    Write-Host "   `$env:Path += `";C:\Gaveta 2\Projetos\Supa`"" -ForegroundColor Gray
    Write-Host "   [Environment]::SetEnvironmentVariable(`"Path`", `$env:Path, [EnvironmentVariableTarget]::User)" -ForegroundColor Gray
} else {
    Write-Host "Erro: Supabase CLI não encontrado em: $supabasePath" -ForegroundColor Red
    Write-Host "Verifique se o arquivo supabase.exe existe nesse caminho." -ForegroundColor Yellow
}

