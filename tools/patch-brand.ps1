$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$base = "c:\Users\user\Desktop\СТРОЙКА"

$logo = '<span class="logo__rem">РЕМ</span><span class="logo__stroy">СТРОЙ</span><span class="logo__num">64</span>'

Get-ChildItem -Path $base -Recurse -Include *.html, *.xml, *.txt | ForEach-Object {
  $p = $_.FullName
  $c = [IO.File]::ReadAllText($p, $utf8)
  $n = $c.Replace("https://example.com", "https://remstroy64.vercel.app")
  $n = $n.Replace("Стройка <span>Саратов</span>", $logo)
  $n = $n.Replace("Стройка Саратов — строительная бригада", "РЕМСТРОЙ64 — строительная бригада")
  $n = $n.Replace("Стройка Саратов", "РЕМСТРОЙ64")
  if ($n -ne $c) {
    [IO.File]::WriteAllText($p, $n, $utf8)
    Write-Host "patched: $p"
  }
}

$incPath = Join-Path $base "partials\local-seo-services.inc.html"
$inc = [IO.File]::ReadAllText($incPath, $utf8)
Get-ChildItem (Join-Path $base "services") -Filter "*.html" | ForEach-Object {
  $p = $_.FullName
  $c = [IO.File]::ReadAllText($p, $utf8)
  if ($c -match 'class="local-seo"') { return }
  $m = '<main id="main">'
  $ix = $c.IndexOf($m)
  if ($ix -lt 0) { Write-Host "skip no main: $($_.Name)"; return }
  $sub = $c.Substring($ix)
  $h = $sub.IndexOf("</header>")
  if ($h -lt 0) { Write-Host "skip no header: $($_.Name)"; return }
  $pos = $ix + $h + "</header>".Length
  $newC = $c.Substring(0, $pos) + $inc + $c.Substring($pos)
  [IO.File]::WriteAllText($p, $newC, $utf8)
  Write-Host "inserted local-seo: $($_.Name)"
}
