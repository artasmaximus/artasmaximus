# Placeholder narration: synthesizes each block with the Windows voice.
# Replace static/playground/*.wav with real recordings, then run analyze-rhythm.mjs.
Add-Type -AssemblyName System.Speech
$out = Join-Path $PSScriptRoot '..\static\playground'
$blocks = @{
  'gpu-1' = 'The whole simulation is one compute shader with four kernels.'
  'gpu-2' = 'One GPU thread per agent samples the trail map ahead of itself, steers, moves, and deposits.'
  'gpu-3' = 'Two blur passes diffuse and fade the trails, and a last pass turns them into the image.'
  'gpu-4' = 'By default that is a million agents on a twenty five sixty by fourteen forty map, with room for two million.'
}
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.Rate = 0
foreach ($k in $blocks.Keys) {
  $s.SetOutputToWaveFile((Join-Path $out "$k.wav"))
  $s.Speak($blocks[$k])
}
$s.Dispose()
Get-ChildItem $out
