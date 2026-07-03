Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("c:\01_ATP\02_Project_Git\atp-kuytanya\frontend\public\logo.png")
$dict = @{}
for ($x=0; $x -lt $img.Width; $x+=5) {
  for ($y=0; $y -lt $img.Height; $y+=5) {
    $c = $img.GetPixel($x, $y)
    if ($c.A -gt 200 -and -not ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) -and -not ($c.R -lt 50 -and $c.G -lt 50 -and $c.B -lt 50)) {
      $hex = "#{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B
      $dict[$hex]++
    }
  }
}
$dict.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10
