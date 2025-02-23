$env:DB_HOST="$((Get-NetIPAddress | Where-Object {$_.AddressFamily -eq 'IPv4'}).IPAddress)" npm start
