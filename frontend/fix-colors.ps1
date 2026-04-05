$files = Get-ChildItem -Path "src" -Recurse -Include "*.js"
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $c) { continue }
    $n = $c
    # Old rose/pink accent -> orange
    $n = $n -replace '#C94F6D', '#D4760A'
    $n = $n -replace '#E07A96', '#E89830'
    # Old muted -> warm brown
    $n = $n -replace '#9B7B84', '#8A6A58'
    $n = $n -replace '#D4A0A8', '#B8862C'
    # Old pink backgrounds -> warm cream
    $n = $n -replace '#FFF0F3', '#FFF3E6'
    $n = $n -replace '#FFF5F7', '#FFF5EC'
    $n = $n -replace '#FFF8F5', '#FFF9F2'
    $n = $n -replace '#F9EED9', '#FFF3E6'
    # Old pink borders -> orange borders
    $n = $n -replace '#FFE8ED', 'rgba(212,118,10,0.12)'
    $n = $n -replace '#FFD6DF', 'rgba(212,118,10,0.18)'
    $n = $n -replace '#FFE4EC', 'rgba(212,118,10,0.12)'
    # Old accent colors
    $n = $n -replace '#FFB3C1', '#F5C97A'
    $n = $n -replace '#D8C3FF', '#FFECD6'
    $n = $n -replace '#A87EF5', '#C68B2C'
    $n = $n -replace '#E8486A', '#D4760A'
    # Old text colors
    $n = $n -replace '#3D1F2C', '#2D1810'
    $n = $n -replace '#2D1B25', '#2D1810'
    # Tailwind custom classes -> inline
    $n = $n -replace 'text-plum/70', 'text-[#8A6A58]'
    $n = $n -replace 'text-plum', 'text-[#2D1810]'
    $n = $n -replace 'text-mauve/70', 'text-[#A8907E]'
    $n = $n -replace 'text-mauve/50', 'text-[#A8907E]'
    $n = $n -replace 'text-mauve/40', 'text-[#A8907E]'
    $n = $n -replace 'text-mauve', 'text-[#8A6A58]'
    $n = $n -replace 'text-rose-dark', 'text-[#6B4A3A]'
    $n = $n -replace 'font-nunito', 'font-dm'
    $n = $n -replace 'border-dustpink/40', 'border-[rgba(212,118,10,0.15)]'
    $n = $n -replace 'border-dustpink/30', 'border-[rgba(212,118,10,0.12)]'
    $n = $n -replace 'border-dustpink/50', 'border-[rgba(212,118,10,0.18)]'
    $n = $n -replace 'border-dustpink/20', 'border-[rgba(212,118,10,0.08)]'
    $n = $n -replace 'border-dustpink', 'border-[rgba(212,118,10,0.15)]'
    $n = $n -replace 'bg-blush-50', 'bg-[rgba(212,118,10,0.04)]'
    $n = $n -replace 'bg-blush-100', 'bg-[rgba(212,118,10,0.08)]'
    $n = $n -replace 'bg-mint', 'bg-[#1A7A6D]'
    $n = $n -replace 'border-rose/60', 'border-[rgba(212,118,10,0.35)]'
    $n = $n -replace 'border-rose/50', 'border-[rgba(212,118,10,0.30)]'
    $n = $n -replace 'border-blush-200', 'border-[rgba(212,118,10,0.15)]'
    $n = $n -replace 'border-t-rose-400', 'border-t-[#D4760A]'
    $n = $n -replace 'border-t-rose', 'border-t-[#D4760A]'
    $n = $n -replace 'border-rose/30', 'border-[rgba(212,118,10,0.18)]'
    $n = $n -replace 'bg-rose-pale', 'bg-[#E89830]'
    $n = $n -replace 'text-rose/50', 'text-[rgba(212,118,10,0.30)]'
    # Old F5F0FF lavender bg
    $n = $n -replace '#F5F0FF', '#FFF5EC'
    $n = $n -replace '#F6F1FF', '#FFF5EC'
    $n = $n -replace '#FFF1F6', '#FFF3E6'
    if ($n -ne $c) {
        Set-Content -Path $f.FullName -Value $n -NoNewline
        Write-Host ("Updated: " + $f.Name)
    }
}
Write-Host "Done!"
