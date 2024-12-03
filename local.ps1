# ira deinir um root
$rootFolder = ".\"

# a partir do rootFolder, busca todos os arquivos existentes de todas as pastas e subpastas
# a cada arquivo encontrado, write-host do nome do arquivo e do caminho completo e realizada um cat do arquivo no console
Get-ChildItem -Path $rootFolder -Recurse -File | ForEach-Object {
    Write-Host "$($_.FullName)`n``````$($_.Name)"
    cat $_.FullName
    Write-Host "``````"
}

Get-ChildItem -Path $rootFolder -Recurse -File | ForEach-Object {
    $output = $($_.FullName).replace("C:\Users\Bruno\repo", ".")
    $fileContent = Get-Content $_.FullName -Raw
    $Content = "``````$($_.Name)`n" + $fileContent
    $ContentFinal = "```````n`n"
    Write-Output $output
    Write-Output $Content
    Write-Output $ContentFinal
} | Out-File -FilePath .\log.txt -Encoding UTF8

