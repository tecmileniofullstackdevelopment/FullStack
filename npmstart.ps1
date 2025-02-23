Set-ExecutionPolicy -ExecutionPolicy ByPass -Scope Process

# Para el que va a compartir la base de datos
$env:DB_HOST="$((Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -match '^(10\.)|(172\.(1[6-9]|2[0-9]|3[01])\.)|(192\.168\.)' -and $_.InterfaceAlias -notmatch 'Docker|Ethernet' }).IPAddress)"; npm start

# Todos los demás llenar la ip
$env:DB_HOST="..."; npm start
