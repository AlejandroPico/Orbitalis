$root = [System.IO.Path]::GetFullPath($PSScriptRoot)
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 8765)
$listener.Start()
$types = @{'.html'='text/html; charset=utf-8';'.js'='text/javascript; charset=utf-8';'.css'='text/css; charset=utf-8';'.jpg'='image/jpeg';'.jpeg'='image/jpeg';'.png'='image/png';'.svg'='image/svg+xml';'.json'='application/json'}
try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream(); $reader = [System.IO.StreamReader]::new($stream)
      $request = $reader.ReadLine(); if (-not $request) { $client.Close(); continue }
      while (($line = $reader.ReadLine()) -ne '') {}
      $urlPath = ($request -split ' ')[1].Split('?')[0]
      if ($urlPath -eq '/') { $urlPath = '/index.html' }
      $relative = [Uri]::UnescapeDataString($urlPath.TrimStart('/')).Replace('/', [IO.Path]::DirectorySeparatorChar)
      $file = [IO.Path]::GetFullPath([IO.Path]::Combine($root, $relative))
      if (-not $file.StartsWith($root) -or -not [IO.File]::Exists($file)) { $status='404 Not Found'; $bytes=[Text.Encoding]::UTF8.GetBytes('404'); $type='text/plain' }
      else { $status='200 OK'; $bytes=[IO.File]::ReadAllBytes($file); $ext=[IO.Path]::GetExtension($file).ToLower(); $type=if($types.ContainsKey($ext)){$types[$ext]}else{'application/octet-stream'} }
      $header="HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
      $head=[Text.Encoding]::ASCII.GetBytes($header); $stream.Write($head,0,$head.Length); $stream.Write($bytes,0,$bytes.Length)
    } finally { $client.Close() }
  }
} finally { $listener.Stop() }
