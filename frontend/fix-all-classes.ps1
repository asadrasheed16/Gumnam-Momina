# Fix ALL remaining old class references across the whole src directory
$files = Get-ChildItem -Path "src" -Recurse -Include "*.js"
foreach ($f in $files) {
    $c = Get-Content -LiteralPath $f.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $c) { continue }
    $n = $c
    # text-plum variants
    $n = $n -replace 'text-plum/70', 'text-[#4A2E20]'
    $n = $n -replace 'text-plum/60', 'text-[#6B4A3A]'
    $n = $n -replace 'text-plum/55', 'text-[#6B4A3A]'
    $n = $n -replace 'text-plum/50', 'text-[#8A6A58]'
    $n = $n -replace 'text-plum/40', 'text-[#A8907E]'
    $n = $n -replace 'text-plum', 'text-[#2D1810]'
    # text-mauve variants
    $n = $n -replace 'text-mauve/70', 'text-[#A8907E]'
    $n = $n -replace 'text-mauve/50', 'text-[#A8907E]'
    $n = $n -replace 'text-mauve/40', 'text-[#A8907E]'
    $n = $n -replace 'text-mauve', 'text-[#8A6A58]'
    # text-rose-dark
    $n = $n -replace 'text-rose-dark', 'text-[#D4760A]'
    # font-nunito / font-cormorant
    $n = $n -replace 'font-nunito', 'font-dm'
    $n = $n -replace 'font-cormorant', 'font-playfair'
    # border-dustpink
    $n = $n -replace 'border-dustpink/50', 'border-[rgba(212,118,10,0.18)]'
    $n = $n -replace 'border-dustpink/40', 'border-[rgba(212,118,10,0.15)]'
    $n = $n -replace 'border-dustpink/30', 'border-[rgba(212,118,10,0.12)]'
    $n = $n -replace 'border-dustpink/20', 'border-[rgba(212,118,10,0.08)]'
    $n = $n -replace 'border-dustpink', 'border-[rgba(212,118,10,0.15)]'
    # bg-blush
    $n = $n -replace 'bg-blush-100', 'bg-[rgba(212,118,10,0.08)]'
    $n = $n -replace 'bg-blush-50', 'bg-[rgba(212,118,10,0.04)]'
    $n = $n -replace 'hover:bg-blush-100', 'hover:bg-[rgba(212,118,10,0.08)]'
    $n = $n -replace 'hover:bg-blush-50', 'hover:bg-[rgba(212,118,10,0.04)]'
    # border-rose
    $n = $n -replace 'border-rose/60', 'border-[rgba(212,118,10,0.35)]'
    $n = $n -replace 'border-rose/50', 'border-[rgba(212,118,10,0.30)]'
    $n = $n -replace 'border-rose/30', 'border-[rgba(212,118,10,0.18)]'
    $n = $n -replace 'hover:border-rose/50', 'hover:border-[rgba(212,118,10,0.30)]'
    $n = $n -replace 'hover:border-rose', 'hover:border-[#D4760A]'
    $n = $n -replace 'focus:border-rose/50', 'focus:border-[rgba(212,118,10,0.30)]'
    $n = $n -replace 'focus-within:border-rose/60', 'focus-within:border-[rgba(212,118,10,0.35)]'
    $n = $n -replace 'border-rose ', 'border-[#D4760A] '
    # border-blush
    $n = $n -replace 'border-blush-200', 'border-[rgba(212,118,10,0.15)]'
    $n = $n -replace 'border-t-rose-400', 'border-t-[#D4760A]'
    $n = $n -replace 'border-t-rose', 'border-t-[#D4760A]'
    # bg-rose-pale
    $n = $n -replace 'bg-rose-pale', 'bg-[#E89830]'
    $n = $n -replace 'bg-roseSoft', 'bg-[rgba(212,118,10,0.06)]'
    $n = $n -replace 'text-rose/50', 'text-[rgba(212,118,10,0.30)]'
    $n = $n -replace 'text-rose/80', 'text-[rgba(212,118,10,0.50)]'
    $n = $n -replace 'text-rose ', 'text-[#D4760A] '
    # bg-mint
    $n = $n -replace 'bg-mint', 'bg-[#1A7A6D]'
    # shadow-float custom -> standard
    # hover:text-rose
    $n = $n -replace 'hover:text-rose', 'hover:text-[#D4760A]'
    # placeholder:text-mauve
    $n = $n -replace 'placeholder:text-mauve/50', 'placeholder:text-[#A8907E]'
    $n = $n -replace 'placeholder:text-mauve', 'placeholder:text-[#A8907E]'
    if ($n -ne $c) {
        Set-Content -LiteralPath $f.FullName -Value $n -NoNewline
        Write-Host ("Fixed: " + $f.FullName.Substring($f.FullName.IndexOf("src")))
    }
}
Write-Host "All files updated!"
