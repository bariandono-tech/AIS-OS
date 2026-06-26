<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudiOS — PARA-Powered Knowledge OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'space': ['"Space Grotesk"', 'sans-serif'],
                        'geist': ['"Geist"', 'sans-serif'],
                        'mono': ['"Geist Mono"', 'monospace'],
                    }
                }
            }
        }
    </script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #030303; color: #ffffff; font-family: 'Geist', sans-serif; overflow-x: hidden; }

        /* Grid Background */
        .grid-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; display: flex; justify-content: center; }
        .grid-bg-inner { width: 100%; max-width: 80rem; display: flex; justify-content: space-between; padding: 0 1rem; }
        .grid-line { width: 1px; height: 100%; background: rgba(255,255,255,0.02); }

        /* Animations */
        @keyframes animationIn {
            0% { opacity: 0; transform: translateY(30px); filter: blur(8px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        .anim-in { animation: animationIn 0.8s ease-out both; }
        .anim-d1 { animation-delay: 0.1s; }
        .anim-d2 { animation-delay: 0.2s; }
        .anim-d3 { animation-delay: 0.3s; }
        .anim-d4 { animation-delay: 0.4s; }
        .anim-d5 { animation-delay: 0.5s; }
        .anim-d6 { animation-delay: 0.6s; }
        .anim-d7 { animation-delay: 0.7s; }
        .anim-d8 { animation-delay: 0.8s; }

        /* Scroll triggered */
        .reveal { opacity: 0; transform: translateY(30px); filter: blur(8px); transition: all 0.8s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); filter: blur(0); }

        /* Gradient text */
        .text-gradient { background: linear-gradient(to right, #c084fc, #60a5fa, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .text-gradient-notes { background: linear-gradient(135deg, #fbbf24, #f59e0b, #c084fc, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .text-gradient-warm { background: linear-gradient(to right, #fbbf24, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        /* Glass card */
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); transition: all 300ms; }
        .glass:hover { border-color: rgba(168,85,247,0.4); box-shadow: 0 0 30px rgba(168,85,247,0.15); }

        /* Notes glow */
        .notes-glow { position: relative; }
        .notes-glow::before {
            content: ''; position: absolute; inset: -2px; border-radius: inherit;
            background: linear-gradient(135deg, rgba(251,191,36,0.3), rgba(168,85,247,0.3), rgba(96,165,250,0.3));
            z-index: -1; opacity: 0; transition: opacity 0.5s;
        }
        .notes-glow:hover::before { opacity: 1; }

        /* PARA nav indicator */
        .para-link { position: relative; }
        .para-link::after {
            content: ''; position: absolute; bottom: -4px; left: 50%; width: 0; height: 2px;
            background: linear-gradient(to right, #a855f7, #3b82f6); transition: all 0.3s; transform: translateX(-50%);
        }
        .para-link:hover::after, .para-link.active::after { width: 100%; }

        /* Tag styles */
        .tag-purple { background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid rgba(168,85,247,0.3); }
        .tag-blue { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
        .tag-amber { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
        .tag-green { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
        .tag-red { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
        .tag-neutral { background: rgba(255,255,255,0.05); color: #a3a3a3; border: 1px solid rgba(255,255,255,0.1); }

        /* Note card specific */
        .note-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1.5rem; transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
        .note-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(251,191,36,0.3); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }

        /* Book card */
        .book-card { transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1); }
        .book-card:hover { transform: translateY(-8px) scale(1.02); }
        .book-spine { width: 6px; border-radius: 3px; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        /* Tab system */
        .tab-btn { transition: all 0.3s; }
        .tab-btn.active { background: rgba(251,191,36,0.15); color: #fbbf24; border-color: rgba(251,191,36,0.4); }
        .tab-content { display: none; }
        .tab-content.active { display: grid; animation: animationIn 0.5s ease-out both; }

        /* PARA section indicator */
        .para-indicator { width: 3px; border-radius: 2px; }

        /* Marquee */
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 40s linear infinite; }
        .marquee-mask { mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }

        /* Pulse dot */
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
        .pulse-dot { animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        /* Connection lines */
        .connection-line { position: absolute; background: linear-gradient(to right, rgba(168,85,247,0.3), rgba(251,191,36,0.3)); height: 1px; }

        /* Floating particles for notes section */
        @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-200px) translateX(30px); opacity: 0; }
        }

        /* Border beam */
        @keyframes spin { from { rotate: 0deg; } to { rotate: 360deg; } }
        .border-beam { animation: spin 4s linear infinite; background: conic-gradient(from 0deg, transparent 0 340deg, #fbbf24 360deg); }

        /* Stat counter */
        .stat-glow { text-shadow: 0 0 20px rgba(168,85,247,0.5); }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }

        /* Mobile nav */
        .mobile-menu { transform: translateX(100%); transition: transform 0.3s ease; }
        .mobile-menu.open { transform: translateX(0); }
    </style>
</head>
<body class="font-geist">

    <!-- Grid Background -->
    <div class="grid-bg">
        <div class="grid-bg-inner">
            <div class="grid-line"></div>
            <div class="grid-line hidden md:block"></div>
            <div class="grid-line hidden lg:block"></div>
            <div class="grid-line hidden lg:block"></div>
            <div class="grid-line"></div>
        </div>
    </div>

    <!-- ==================== NAVIGATION ==================== -->
    <nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <div class="glass rounded-2xl px-4 py-3 flex items-center justify-between" style="background: rgba(0,0,0,0.9); box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);">
            <!-- Logo -->
            <a href="#hero" class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, #7c3aed, #2563eb);">
                    <iconify-icon icon="solar:document-bold-duotone" width="16" style="color: white;"></iconify-icon>
                </div>
                <span class="font-space font-semibold text-sm tracking-tight">StudiOS</span>
            </a>

            <!-- PARA Links (Desktop) -->
            <div class="hidden md:flex items-center gap-1">
                <a href="#projects" class="para-link text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-150 px-3 py-2">Projects</a>
                <a href="#areas" class="para-link text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-150 px-3 py-2">Areas</a>
                <a href="#resources" class="para-link text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-150 px-3 py-2">Resources</a>
                <a href="#tasks" class="para-link text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-150 px-3 py-2">Tasks</a>
                <a href="#notes" class="para-link active text-xs tracking-widest uppercase text-amber-400 hover:text-amber-300 transition-colors duration-150 px-3 py-2">Notes</a>
                <a href="#archive" class="para-link text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors duration-150 px-3 py-2">Archive</a>
            </div>

            <!-- CTA + Mobile toggle -->
            <div class="flex items-center gap-3">
                <a href="#notes" class="hidden sm:flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-xl text-white transition-all duration-300 hover:scale-105" style="background: linear-gradient(135deg, #7c3aed, #2563eb); box-shadow: 0 0 12px rgba(168,85,247,0.8);">
                    <iconify-icon icon="solar:arrow-right-linear" width="14"></iconify-icon>
                    Mulai Gratis
                </a>
                <button id="mobileToggle" class="md:hidden p-2 text-neutral-400 hover:text-white transition-colors">
                    <iconify-icon icon="solar:hamburger-menu-linear" width="20"></iconify-icon>
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="mobile-menu fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6">
        <button id="mobileClose" class="absolute top-8 right-6 text-neutral-400 hover:text-white">
            <iconify-icon icon="solar:close-circle-linear" width="28"></iconify-icon>
        </button>
        <a href="#projects" class="mobile-link text-2xl font-space font-light tracking-tight text-neutral-400 hover:text-white transition-colors">Projects</a>
        <a href="#areas" class="mobile-link text-2xl font-space font-light tracking-tight text-neutral-400 hover:text-white transition-colors">Areas</a>
        <a href="#resources" class="mobile-link text-2xl font-space font-light tracking-tight text-neutral-400 hover:text-white transition-colors">Resources</a>
        <a href="#tasks" class="mobile-link text-2xl font-space font-light tracking-tight text-neutral-400 hover:text-white transition-colors">Tasks</a>
        <a href="#notes" class="mobile-link text-2xl font-space font-light tracking-tight text-amber-400 hover:text-amber-300 transition-colors">Notes</a>
        <a href="#archive" class="mobile-link text-2xl font-space font-light tracking-tight text-neutral-400 hover:text-white transition-colors">Archive</a>
        <a href="#notes" class="mt-4 text-xs font-bold tracking-widest uppercase px-8 py-3 rounded-xl text-white" style="background: linear-gradient(135deg, #7c3aed, #2563eb);">Mulai Gratis</a>
    </div>

    <!-- ==================== HERO ==================== -->
    <section id="hero" class="relative min-h-screen flex flex-col items-center justify-center px-4 pt-40 md:pt-52 pb-20 md:pb-32">
        <!-- Decorative orbs -->
        <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none" style="background: radial-gradient(circle, #7c3aed, transparent 70%);"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 pointer-events-none" style="background: radial-gradient(circle, #2563eb, transparent 70%);"></div>

        <div class="relative z-10 max-w-6xl mx-auto text-center">
            <!-- Badge -->
            <div class="anim-in anim-d1 inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08);">
                <span class="w-2 h-2 rounded-full bg-green-400 pulse-dot"></span>
                <span class="text-xs tracking-widest uppercase text-neutral-400">Terintegrasi Notion • PARA Method</span>
            </div>

            <!-- Main heading -->
            <h1 class="anim-in anim-d2 font-space font-semibold text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tighter uppercase mb-6">
                <span class="block text-white">Knowledge</span>
                <span class="block text-gradient">Operating System</span>
            </h1>

            <!-- Sub -->
            <p class="anim-in anim-d3 text-lg sm:text-xl md:text-2xl font-light text-neutral-400 max-w-3xl mx-auto leading-relaxed tracking-tight mb-4">
                StudiOS memirror <strong class="text-white font-normal">PARA Dashboard</strong> Thomas J Frank langsung di Notion — untuk mahasiswa, dosen, peneliti, dan siapa saja yang serius dengan PKM.
            </p>
            <p class="anim-in anim-d4 text-sm text-neutral-500 max-w-2xl mx-auto mb-10">
                Projects · Areas · Resources · Tasks · <span class="text-amber-400 font-medium">Notes</span> · Archive — semua terstruktur, terhubung, dan powerful.
            </p>

            <!-- CTA buttons -->
            <div class="anim-in anim-d5 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <a href="#notes" class="group flex items-center gap-3 text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-xl text-white transition-all duration-300 hover:scale-105" style="background: linear-gradient(135deg, #7c3aed, #2563eb); box-shadow: 0 0 20px rgba(124,58,237,0.5);">
                    Jelajahi Notes
                    <iconify-icon icon="solar:arrow-right-linear" width="16" class="transition-transform group-hover:translate-x-1"></iconify-icon>
                </a>
                <a href="#projects" class="group flex items-center gap-3 text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-xl text-neutral-300 border transition-all duration-300 hover:border-purple-500/40 hover:text-white" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08);">
                    <iconify-icon icon="solar:play-circle-linear" width="16"></iconify-icon>
                    Lihat PARA Flow
                </a>
            </div>

            <!-- PARA Mini Dashboard Preview -->
            <div class="anim-in anim-d6 relative max-w-4xl mx-auto">
                <div class="glass rounded-2xl p-1 overflow-hidden" style="box-shadow: 0 0 60px rgba(124,58,237,0.15);">
                    <!-- Browser bar -->
                    <div class="flex items-center gap-2 px-4 py-3 border-b" style="border-color: rgba(255,255,255,0.05);">
                        <div class="flex gap-1.5">
                            <div class="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
                            <div class="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
                        </div>
                        <div class="flex-1 mx-4">
                            <div class="max-w-xs mx-auto px-4 py-1.5 rounded-lg text-[10px] tracking-widest uppercase text-neutral-500 text-center" style="background: rgba(255,255,255,0.03);">
                                studio-os.notion.site/para-dashboard
                            </div>
                        </div>
                    </div>
                    <!-- Dashboard content -->
                    <div class="flex min-h-[320px] md:min-h-[400px]">
                        <!-- Sidebar -->
                        <div class="hidden md:flex flex-col w-56 border-r p-4 gap-1" style="border-color: rgba(255,255,255,0.05); background: rgba(255,255,255,0.01);">
                            <div class="flex items-center gap-2 mb-4 px-2">
                                <div class="w-5 h-5 rounded flex items-center justify-center" style="background: linear-gradient(135deg, #7c3aed, #2563eb);">
                                    <iconify-icon icon="solar:document-bold-duotone" width="12" style="color:white;"></iconify-icon>
                                </div>
                                <span class="text-xs font-space font-semibold tracking-tight">StudiOS</span>
                            </div>
                            <a href="#projects" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
                                <iconify-icon icon="solar:folder-bold-duotone" width="16" style="color:#a855f7;"></iconify-icon> Projects
                                <span class="ml-auto text-[10px] tag-purple rounded px-1.5 py-0.5">4</span>
                            </a>
                            <a href="#areas" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
                                <iconify-icon icon="solar:widget-bold-duotone" width="16" style="color:#3b82f6;"></iconify-icon> Areas
                                <span class="ml-auto text-[10px] tag-blue rounded px-1.5 py-0.5">6</span>
                            </a>
                            <a href="#resources" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
                                <iconify-icon icon="solar:library-bold-duotone" width="16" style="color:#22c55e;"></iconify-icon> Resources
                                <span class="ml-auto text-[10px] tag-green rounded px-1.5 py-0.5">12</span>
                            </a>
                            <a href="#tasks" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
                                <iconify-icon icon="solar:checklist-bold-duotone" width="16" style="color:#f87171;"></iconify-icon> Tasks
                                <span class="ml-auto text-[10px] tag-red rounded px-1.5 py-0.5">23</span>
                            </a>
                            <a href="#notes" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-amber-400 bg-amber-400/5 border border-amber-400/20 transition-all">
                                <iconify-icon icon="solar:notebook-bold-duotone" width="16" style="color:#fbbf24;"></iconify-icon> Notes
                                <span class="ml-auto text-[10px] tag-amber rounded px-1.5 py-0.5">47</span>
                            </a>
                            <a href="#archive" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-neutral-600 hover:text-white hover:bg-white/5 transition-all">
                                <iconify-icon icon="solar:archive-bold-duotone" width="16" style="color:#525252;"></iconify-icon> Archive
                            </a>
                        </div>
                        <!-- Main content preview -->
                        <div class="flex-1 p-6 md:p-8">
                            <div class="flex items-center gap-2 mb-6">
                                <iconify-icon icon="solar:notebook-bold-duotone" width="20" style="color:#fbbf24;"></iconify-icon>
                                <h3 class="font-space font-semibold text-lg tracking-tight">Notes</h3>
                                <span class="text-[10px] tag-amber rounded px-2 py-0.5 uppercase tracking-widest">Highlight</span>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div class="rounded-lg p-4 border" style="background: rgba(251,191,36,0.03); border-color: rgba(251,191,36,0.15);">
                                    <div class="text-[10px] tag-amber rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Catatan Kuliah</div>
                                    <div class="text-sm font-medium mb-1">Metodologi Penelitian Kuantitatif</div>
                                    <div class="text-xs text-neutral-500 line-clamp-2">Variabel independen, dependen, dan kontrol dalam desain eksperimen true...</div>
                                </div>
                                <div class="rounded-lg p-4 border" style="background: rgba(168,85,247,0.03); border-color: rgba(168,85,247,0.15);">
                                    <div class="text-[10px] tag-purple rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Buku</div>
                                    <div class="text-sm font-medium mb-1">How to Take Smart Notes — Sönke Ahrens</div>
                                    <div class="text-xs text-neutral-500 line-clamp-2">Zettelkasten method untuk menulis dan berpikir secara kreatif...</div>
                                </div>
                                <div class="rounded-lg p-4 border" style="background: rgba(59,130,246,0.03); border-color: rgba(59,130,246,0.15);">
                                    <div class="text-[10px] tag-blue rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Jurnal</div>
                                    <div class="text-sm font-medium mb-1">The Effect of AI on Education (2024)</div>
                                    <div class="text-xs text-neutral-500 line-clamp-2">Systematic review: 45 studies tentang implementasi AI dalam pembelajaran...</div>
                                </div>
                                <div class="rounded-lg p-4 border" style="background: rgba(34,197,94,0.03); border-color: rgba(34,197,94,0.15);">
                                    <div class="text-[10px] tag-green rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Referensi Web</div>
                                    <div class="text-sm font-medium mb-1">Notion PARA Guide — Thomas J Frank</div>
                                    <div class="text-xs text-neutral-500 line-clamp-2">Complete guide to organizing your digital life using PARA...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Glow under dashboard -->
                <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 rounded-full" style="background: radial-gradient(ellipse, rgba(124,58,237,0.2), transparent 70%); filter: blur(20px);"></div>
            </div>
        </div>
    </section>

    <!-- ==================== STATS MARQUEE ==================== -->
    <section class="relative z-10 border-y py-6 marquee-mask" style="border-color: rgba(255,255,255,0.05);">
        <div class="flex marquee-track" style="width: 200%;">
            <div class="flex items-center gap-12 px-6 w-1/2">
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">6</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">PARA Categories</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">∞</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">Nested Pages</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">100%</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">Notion Sync</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-amber-400 stat-glow">47+</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">Note Templates</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">PKM</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">First Design</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">0</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">Learning Curve</span>
                </div>
            </div>
            <div class="flex items-center gap-12 px-6 w-1/2">
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">6</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">PARA Categories</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">∞</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">Nested Pages</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">100%</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">Notion Sync</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-amber-400 stat-glow">47+</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">Note Templates</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">PKM</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">First Design</span>
                </div>
                <div class="w-px h-8" style="background: rgba(255,255,255,0.08);"></div>
                <div class="flex items-center gap-3 whitespace-nowrap">
                    <span class="text-3xl font-space font-light tracking-tighter text-white stat-glow">0</span>
                    <span class="text-xs tracking-widest uppercase text-neutral-500">Learning Curve</span>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== PROJECTS ==================== -->
    <section id="projects" class="relative z-10 py-24 md:py-32 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="reveal flex items-start gap-6 mb-16">
                <div class="para-indicator h-16 mt-2 flex-shrink-0" style="background: linear-gradient(to bottom, #a855f7, transparent);"></div>
                <div>
                    <div class="text-[10px] tracking-widest uppercase text-purple-400 mb-3">01 / Projects</div>
                    <h2 class="font-space font-light text-4xl md:text-6xl tracking-tighter uppercase leading-none mb-4">
                        Active<br><span class="text-gradient font-semibold">Projects</span>
                    </h2>
                    <p class="text-neutral-400 text-sm max-w-lg leading-relaxed">Proyek aktif yang memiliki deadline jelas. Setiap project terhubung langsung ke Tasks dan Notes terkait di Notion.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                <!-- Project Card 1 -->
                <div class="reveal glass rounded-xl p-6 group">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-[10px] tag-purple rounded px-2 py-0.5 uppercase tracking-widest">Skripsi</span>
                        <iconify-icon icon="solar:arrow-right-up-linear" width="16" class="text-neutral-600 group-hover:text-purple-400 transition-colors"></iconify-icon>
                    </div>
                    <h3 class="font-space text-lg tracking-tight mb-2">Pengaruh AI Terhadap Motivasi Belajar</h3>
                    <p class="text-xs text-neutral-500 mb-4 leading-relaxed">Penelitian kuantitatif dengan sampel 200 mahasiswa di 3 universitas.</p>
                    <div class="flex items-center gap-3">
                        <div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.05);">
                            <div class="h-full rounded-full w-3/5" style="background: linear-gradient(to right, #7c3aed, #a855f7);"></div>
                        </div>
                        <span class="text-[10px] text-neutral-500 font-mono">60%</span>
                    </div>
                </div>
                <!-- Project Card 2 -->
                <div class="reveal glass rounded-xl p-6 group" style="transition-delay: 0.1s;">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-[10px] tag-blue rounded px-2 py-0.5 uppercase tracking-widest">Organisasi</span>
                        <iconify-icon icon="solar:arrow-right-up-linear" width="16" class="text-neutral-600 group-hover:text-blue-400 transition-colors"></iconify-icon>
                    </div>
                    <h3 class="font-space text-lg tracking-tight mb-2">Workshop PKM untuk Freshman</h3>
                    <p class="text-xs text-neutral-500 mb-4 leading-relaxed">Mengajar metode Zettelkasten dan PARA ke 50 mahasiswa baru.</p>
                    <div class="flex items-center gap-3">
                        <div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.05);">
                            <div class="h-full rounded-full w-2/5" style="background: linear-gradient(to right, #2563eb, #3b82f6);"></div>
                        </div>
                        <span class="text-[10px] text-neutral-500 font-mono">40%</span>
                    </div>
                </div>
                <!-- Project Card 3 -->
                <div class="reveal glass rounded-xl p-6 group" style="transition-delay: 0.2s;">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-[10px] tag-green rounded px-2 py-0.5 uppercase tracking-widest">Penelitian</span>
                        <iconify-icon icon="solar:arrow-right-up-linear" width="16" class="text-neutral-600 group-hover:text-green-400 transition-colors"></iconify-icon>
                    </div>
                    <h3 class="font-space text-lg tracking-tight mb-2">Systematic Review: Gamifikasi</h3>
                    <p class="text-xs text-neutral-500 mb-4 leading-relaxed">Review 60 jurnal tentang gamifikasi dalam education 2020-2024.</p>
                    <div class="flex items-center gap-3">
                        <div class="flex-1 h-1.5 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.05);">
                            <div class="h-full rounded-full w-4/5" style="background: linear-gradient(to right, #16a34a, #22c55e);"></div>
                        </div>
                        <span class="text-[10px] text-neutral-500 font-mono">80%</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== AREAS ==================== -->
    <section id="areas" class="relative z-10 py-24 md:py-32 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="reveal flex items-start gap-6 mb-16">
                <div class="para-indicator h-16 mt-2 flex-shrink-0" style="background: linear-gradient(to bottom, #3b82f6, transparent);"></div>
                <div>
                    <div class="text-[10px] tracking-widest uppercase text-blue-400 mb-3">02 / Areas</div>
                    <h2 class="font-space font-light text-4xl md:text-6xl tracking-tighter uppercase leading-none mb-4">
                        Ongoing<br><span class="text-gradient font-semibold">Areas</span>
                    </h2>
                    <p class="text-neutral-400 text-sm max-w-lg leading-relaxed">Bidang tanggung jawab berkelanjutan tanpa deadline. Area menjaga fokus jangka panjang Anda tetap terorganisir.</p>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
                <div class="reveal glass rounded-xl p-5 text-center group">
                    <iconify-icon icon="solar:square-academic-cap-bold-duotone" width="28" class="text-blue-400 mb-3"></iconify-icon>
                    <div class="text-xs font-medium tracking-tight mb-1">Akademik</div>
                    <div class="text-[10px] text-neutral-600">IPK, KRS, Nilai</div>
                </div>
                <div class="reveal glass rounded-xl p-5 text-center group" style="transition-delay:0.05s">
                    <iconify-icon icon="solar:health-bold-duotone" width="28" class="text-green-400 mb-3"></iconify-icon>
                    <div class="text-xs font-medium tracking-tight mb-1">Kesehatan</div>
                    <div class="text-[10px] text-neutral-600">Olahraga, Diet</div>
                </div>
                <div class="reveal glass rounded-xl p-5 text-center group" style="transition-delay:0.1s">
                    <iconify-icon icon="solar:wallet-bold-duotone" width="28" class="text-amber-400 mb-3"></iconify-icon>
                    <div class="text-xs font-medium tracking-tight mb-1">Keuangan</div>
                    <div class="text-[10px] text-neutral-600">Budget, Tabungan</div>
                </div>
                <div class="reveal glass rounded-xl p-5 text-center group" style="transition-delay:0.15s">
                    <iconify-icon icon="solar:pen-new-round-bold-duotone" width="28" class="text-purple-400 mb-3"></iconify-icon>
                    <div class="text-xs font-medium tracking-tight mb-1">Menulis</div>
                    <div class="text-[10px] text-neutral-600">Blog, Jurnal</div>
                </div>
                <div class="reveal glass rounded-xl p-5 text-center group" style="transition-delay:0.2s">
                    <iconify-icon icon="solar:users-group-rounded-bold-duotone" width="28" class="text-red-400 mb-3"></iconify-icon>
                    <div class="text-xs font-medium tracking-tight mb-1">Sosial</div>
                    <div class="text-[10px] text-neutral-600">Komunitas, Mentoring</div>
                </div>
                <div class="reveal glass rounded-xl p-5 text-center group" style="transition-delay:0.25s">
                    <iconify-icon icon="solar:code-bold-duotone" width="28" class="text-cyan-400 mb-3"></iconify-icon>
                    <div class="text-xs font-medium tracking-tight mb-1">Skill Dev</div>
                    <div class="text-[10px] text-neutral-600">Coding, Design</div>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== RESOURCES ==================== -->
    <section id="resources" class="relative z-10 py-24 md:py-32 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="reveal flex items-start gap-6 mb-16">
                <div class="para-indicator h-16 mt-2 flex-shrink-0" style="background: linear-gradient(to bottom, #22c55e, transparent);"></div>
                <div>
                    <div class="text-[10px] tracking-widest uppercase text-green-400 mb-3">03 / Resources</div>
                    <h2 class="font-space font-light text-4xl md:text-6xl tracking-tighter uppercase leading-none mb-4">
                        Reference<br><span class="text-gradient font-semibold">Resources</span>
                    </h2>
                    <p class="text-neutral-400 text-sm max-w-lg leading-relaxed">Topik minat dan materi referensi yang menjadi "bahan bakar" untuk Projects dan Notes Anda.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                <div class="reveal glass rounded-xl p-6 flex gap-4">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);">
                        <iconify-icon icon="solar:book-bold-duotone" width="24" style="color:#22c55e;"></iconify-icon>
                    </div>
                    <div>
                        <h3 class="font-space text-sm tracking-tight mb-1">Metodologi Penelitian</h3>
                        <p class="text-xs text-neutral-500 leading-relaxed">Kuantitatif, Kualitatif, Mixed Method, Systematic Review, Meta-Analisis</p>
                        <div class="flex gap-1.5 mt-3">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">12 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">3 buku</span>
                        </div>
                    </div>
                </div>
                <div class="reveal glass rounded-xl p-6 flex gap-4" style="transition-delay:0.1s">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2);">
                        <iconify-icon icon="solar:cpu-bolt-bold-duotone" width="24" style="color:#3b82f6;"></iconify-icon>
                    </div>
                    <div>
                        <h3 class="font-space text-sm tracking-tight mb-1">Artificial Intelligence in Education</h3>
                        <p class="text-xs text-neutral-500 leading-relaxed">LLM, Adaptive Learning, AI Tutoring, Ethical AI, Generative AI</p>
                        <div class="flex gap-1.5 mt-3">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">23 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">8 jurnal</span>
                        </div>
                    </div>
                </div>
                <div class="reveal glass rounded-xl p-6 flex gap-4" style="transition-delay:0.15s">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.2);">
                        <iconify-icon icon="solar:lightbulb-bolt-bold-duotone" width="24" style="color:#a855f7;"></iconify-icon>
                    </div>
                    <div>
                        <h3 class="font-space text-sm tracking-tight mb-1">Personal Knowledge Management</h3>
                        <p class="text-xs text-neutral-500 leading-relaxed">Zettelkasten, PARA, Building a Second Brain, Progressive Summarization</p>
                        <div class="flex gap-1.5 mt-3">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">19 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">5 buku</span>
                        </div>
                    </div>
                </div>
                <div class="reveal glass rounded-xl p-6 flex gap-4" style="transition-delay:0.2s">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2);">
                        <iconify-icon icon="solar:graph-new-bold-duotone" width="24" style="color:#fbbf24;"></iconify-icon>
                    </div>
                    <div>
                        <h3 class="font-space text-sm tracking-tight mb-1">Statistik & Analisis Data</h3>
                        <p class="text-xs text-neutral-500 leading-relaxed">SPSS, R, Regression, SEM, Factor Analysis, Bayesian Statistics</p>
                        <div class="flex gap-1.5 mt-3">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">15 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">2 kursus</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== TASKS ==================== -->
    <section id="tasks" class="relative z-10 py-24 md:py-32 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="reveal flex items-start gap-6 mb-16">
                <div class="para-indicator h-16 mt-2 flex-shrink-0" style="background: linear-gradient(to bottom, #f87171, transparent);"></div>
                <div>
                    <div class="text-[10px] tracking-widest uppercase text-red-400 mb-3">04 / Tasks</div>
                    <h2 class="font-space font-light text-4xl md:text-6xl tracking-tighter uppercase leading-none mb-4">
                        Actionable<br><span class="text-gradient font-semibold">Tasks</span>
                    </h2>
                    <p class="text-neutral-400 text-sm max-w-lg leading-relaxed">Aksi konkret yang tertaut ke Project. Setiap task bisa di-breakdown dan dihubungkan ke note yang relevan.</p>
                </div>
            </div>
            <div class="reveal glass rounded-2xl p-6 md:p-8 max-w-3xl">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <iconify-icon icon="solar:checklist-bold-duotone" width="20" style="color:#f87171;"></iconify-icon>
                        <span class="text-sm font-medium">Task Board — Skripsi</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span class="text-[10px] text-neutral-500">5 of 12 done</span>
                    </div>
                </div>
                <!-- Task items -->
                <div class="space-y-2">
                    <div class="flex items-center gap-3 px-4 py-3 rounded-lg" style="background: rgba(255,255,255,0.02);">
                        <div class="w-5 h-5 rounded-md border-2 border-green-500 bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <iconify-icon icon="solar:check-read-linear" width="12" style="color:#22c55e;"></iconify-icon>
                        </div>
                        <span class="text-sm text-neutral-500 line-through">Literature review 20 jurnal terkait</span>
                        <span class="ml-auto text-[10px] tag-green rounded px-2 py-0.5 flex-shrink-0">Done</span>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-3 rounded-lg" style="background: rgba(255,255,255,0.02);">
                        <div class="w-5 h-5 rounded-md border-2 border-green-500 bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <iconify-icon icon="solar:check-read-linear" width="12" style="color:#22c55e;"></iconify-icon>
                        </div>
                        <span class="text-sm text-neutral-500 line-through">Buat instrumen kuesioner</span>
                        <span class="ml-auto text-[10px] tag-green rounded px-2 py-0.5 flex-shrink-0">Done</span>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-3 rounded-lg border border-amber-400/20" style="background: rgba(251,191,36,0.03);">
                        <div class="w-5 h-5 rounded-md border-2 border-amber-400 flex-shrink-0"></div>
                        <span class="text-sm text-white">Uji validitas instrumen ke 30 responden</span>
                        <span class="ml-auto text-[10px] tag-amber rounded px-2 py-0.5 flex-shrink-0">In Progress</span>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-3 rounded-lg" style="background: rgba(255,255,255,0.02);">
                        <div class="w-5 h-5 rounded-md border-2 border-neutral-700 flex-shrink-0"></div>
                        <span class="text-sm text-neutral-400">Distribusi kuesioner ke 200 responden</span>
                        <span class="ml-auto text-[10px] tag-neutral rounded px-2 py-0.5 flex-shrink-0">Todo</span>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-3 rounded-lg" style="background: rgba(255,255,255,0.02);">
                        <div class="w-5 h-5 rounded-md border-2 border-neutral-700 flex-shrink-0"></div>
                        <span class="text-sm text-neutral-400">Analisis data dengan SPSS</span>
                        <span class="ml-auto text-[10px] tag-neutral rounded px-2 py-0.5 flex-shrink-0">Todo</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== ★ NOTES — HIGHLIGHT SECTION ★ ==================== -->
    <section id="notes" class="relative z-10 py-32 md:py-44 px-4">
        <!-- Background effects for Notes section -->
        <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(ellipse 60% 40% at 50% 20%, rgba(251,191,36,0.06), transparent 70%);"></div>
        <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(ellipse 40% 30% at 80% 60%, rgba(168,85,247,0.05), transparent 70%);"></div>
        <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(ellipse 40% 30% at 20% 80%, rgba(59,130,246,0.04), transparent 70%);"></div>

        <div class="max-w-7xl mx-auto relative">
            <!-- Section Header -->
            <div class="reveal text-center mb-6">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style="background: rgba(251,191,36,0.05); border-color: rgba(251,191,36,0.2);">
                    <iconify-icon icon="solar:star-bold-duotone" width="14" style="color:#fbbf24;"></iconify-icon>
                    <span class="text-[10px] tracking-widest uppercase text-amber-400">The Heart of StudiOS</span>
                </div>
            </div>

            <div class="reveal text-center mb-8">
                <div class="text-[10px] tracking-widest uppercase text-amber-400/60 mb-4">05 / Notes</div>
                <h2 class="font-space font-semibold text-5xl sm:text-7xl md:text-9xl tracking-tighter uppercase leading-[0.85] mb-6">
                    <span class="text-gradient-notes">Notes</span>
                </h2>
                <p class="text-lg md:text-xl font-light text-neutral-400 max-w-3xl mx-auto leading-relaxed tracking-tight">
                    Bukan sekadar catatan — ini adalah <strong class="text-white font-normal">inti dari seluruh sistem knowledge Anda</strong>. Catatan terstruktur, referensi buku & jurnal, semuanya saling terhubung membentuk jaringan pengetahuan yang hidup.
                </p>
            </div>

            <!-- Notes Power Features -->
            <div class="reveal grid grid-cols-1 sm:grid-cols-3 gap-1 mb-12 max-w-4xl mx-auto">
                <div class="glass rounded-xl p-5 text-center">
                    <iconify-icon icon="solar:link-round-bold-duotone" width="24" class="text-amber-400 mb-2"></iconify-icon>
                    <div class="text-xs font-medium mb-1">Bi-directional Links</div>
                    <div class="text-[10px] text-neutral-500">Setiap note terhubung ke note lain, project, dan resource</div>
                </div>
                <div class="glass rounded-xl p-5 text-center">
                    <iconify-icon icon="solar:layers-bold-duotone" width="24" class="text-purple-400 mb-2"></iconify-icon>
                    <div class="text-xs font-medium mb-1">Structured Templates</div>
                    <div class="text-[10px] text-neutral-500">Cornell, Zettelkasten, Literature Review, Meeting Notes</div>
                </div>
                <div class="glass rounded-xl p-5 text-center">
                    <iconify-icon icon="solar:tag-bold-duotone" width="24" class="text-blue-400 mb-2"></iconify-icon>
                    <div class="text-xs font-medium mb-1">Smart Metadata</div>
                    <div class="text-[10px] text-neutral-500">Tag otomatis, kategori, penulis, tahun, DOI untuk referensi</div>
                </div>
            </div>

            <!-- Tab Navigation -->
            <div class="reveal flex flex-wrap items-center justify-center gap-2 mb-10">
                <button class="tab-btn active text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-lg border transition-all" style="border-color: rgba(255,255,255,0.08);" data-tab="structured">
                    <iconify-icon icon="solar:document-text-bold-duotone" width="14" class="mr-1.5 align-[-2px]"></iconify-icon>
                    Catatan Terstruktur
                </button>
                <button class="tab-btn text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-lg border text-neutral-500 hover:text-white transition-all" style="border-color: rgba(255,255,255,0.08);" data-tab="books">
                    <iconify-icon icon="solar:book-bold-duotone" width="14" class="mr-1.5 align-[-2px]"></iconify-icon>
                    Buku
                </button>
                <button class="tab-btn text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-lg border text-neutral-500 hover:text-white transition-all" style="border-color: rgba(255,255,255,0.08);" data-tab="journals">
                    <iconify-icon icon="solar:notebook-bold-duotone" width="14" class="mr-1.5 align-[-2px]"></iconify-icon>
                    Jurnal
                </button>
                <button class="tab-btn text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-lg border text-neutral-500 hover:text-white transition-all" style="border-color: rgba(255,255,255,0.08);" data-tab="web">
                    <iconify-icon icon="solar:global-bold-duotone" width="14" class="mr-1.5 align-[-2px]"></iconify-icon>
                    Web Clipping
                </button>
            </div>

            <!-- Tab Content: Structured Notes -->
            <div id="tab-structured" class="tab-content active grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Note 1 - Cornell Style -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-[10px] tag-amber rounded px-2 py-0.5 uppercase tracking-widest">Cornell Notes</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2024-01-15</span>
                    </div>
                    <h3 class="font-space text-base tracking-tight mb-3">Metodologi Penelitian Kuantitatif</h3>
                    <div class="space-y-2 mb-4">
                        <div class="flex gap-3">
                            <div class="text-[10px] text-amber-400/70 w-16 flex-shrink-0 pt-0.5">Cue</div>
                            <div class="text-[11px] text-neutral-300 leading-relaxed">Apa perbedaan desain eksperimen true vs quasi?</div>
                        </div>
                        <div class="flex gap-3">
                            <div class="text-[10px] text-blue-400/70 w-16 flex-shrink-0 pt-0.5">Notes</div>
                            <div class="text-[11px] text-neutral-400 leading-relaxed"><strong class="text-neutral-200">True experiment</strong>: random assignment, control group. <strong class="text-neutral-200">Quasi</strong>: no random assignment, natural groups.</div>
                        </div>
                        <div class="flex gap-3">
                            <div class="text-[10px] text-green-400/70 w-16 flex-shrink-0 pt-0.5">Summary</div>
                            <div class="text-[11px] text-neutral-500 leading-relaxed">Kunci perbedaan ada di randomisasi subjek...</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#metodologi</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#kuantitatif</span>
                        <iconify-icon icon="solar:link-round-linear" width="12" class="text-neutral-600 ml-auto" title="3 linked notes"></iconify-icon>
                    </div>
                </div>

                <!-- Note 2 - Zettelkasten -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-[10px] tag-purple rounded px-2 py-0.5 uppercase tracking-widest">Zettelkasten</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2024-01-14</span>
                    </div>
                    <h3 class="font-space text-base tracking-tight mb-3">ZK-047: Paradox of Active Learning</h3>
                    <div class="text-[11px] text-neutral-400 leading-relaxed mb-4">
                        <p class="mb-2">Active learning membutuhkan <span class="bg-amber-400/10 text-amber-300 px-1 rounded">efort kognitif tinggi</span> tapi justru di situlah terjadi pembentukan memori jangka panjang yang kuat (Bjork, 1994).</p>
                        <p>Ini bertentangan dengan intuisi "belajar harus mudah" — <em>desirable difficulties</em> justru meningkatkan retensi.</p>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#learning-science</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#cognition</span>
                        <div class="flex items-center gap-1 ml-auto text-[10px] text-purple-400/60">
                            <iconify-icon icon="solar:link-round-linear" width="10"></iconify-icon>
                            <span>← ZK-023, ZK-031</span>
                        </div>
                    </div>
                </div>

                <!-- Note 3 - Literature Review -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-[10px] tag-blue rounded px-2 py-0.5 uppercase tracking-widest">Lit Review</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2024-01-13</span>
                    </div>
                    <h3 class="font-space text-base tracking-tight mb-3">Gap Analysis: AI & Motivasi Belajar</h3>
                    <div class="space-y-2 mb-4">
                        <div class="flex items-start gap-2">
                            <div class="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                            <div class="text-[11px] text-neutral-400"><strong class="text-neutral-300">Gap 1:</strong> Sedikit riset yang mengukur motivasi intrinsik vs ekstrinsik secara terpisah</div>
                        </div>
                        <div class="flex items-start gap-2">
                            <div class="w-1 h-1 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                            <div class="text-[11px] text-neutral-400"><strong class="text-neutral-300">Gap 2:</strong> Konteks mahasiswa Indonesia masih terbatas</div>
                        </div>
                        <div class="flex items-start gap-2">
                            <div class="w-1 h-1 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                            <div class="text-[11px] text-neutral-400"><strong class="text-neutral-300">Opportunity:</strong> Menggunakan SDT (Self-Determination Theory) sebagai framework</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#AI-edu</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#motivasi</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#gap</span>
                    </div>
                </div>

                <!-- Note 4 - Meeting Notes -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-[10px] tag-green rounded px-2 py-0.5 uppercase tracking-widest">Meeting</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2024-01-12</span>
                    </div>
                    <h3 class="font-space text-base tracking-tight mb-3">Bimbingan Skripsi #3 — Pembahasan Instrumen</h3>
                    <div class="text-[11px] text-neutral-400 leading-relaxed mb-4">
                        <p class="mb-1"><strong class="text-neutral-300">Pembimbing:</strong> Dr. Sari Dewi, M.Pd</p>
                        <p class="mb-1"><strong class="text-neutral-300">Key Points:</strong></p>
                        <ul class="list-disc list-inside text-neutral-500 space-y-0.5">
                            <li>Tambahkan item tentang perceived usefulness</li>
                            <li>Gunakan skala Likert 5 poin</li>
                            <li>Validasi konten oleh 3 expert</li>
                        </ul>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#bimbingan</span>
                        <span class="text-[10px] tag-red rounded px-2 py-0.5">→ 3 tasks created</span>
                    </div>
                </div>

                <!-- Note 5 - Concept Map -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-[10px] tag-amber rounded px-2 py-0.5 uppercase tracking-widest">Concept</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2024-01-11</span>
                    </div>
                    <h3 class="font-space text-base tracking-tight mb-3">Hubungan SDT — Motivasi — AI Tools</h3>
                    <div class="text-[11px] text-neutral-400 leading-relaxed mb-4">
                        <div class="flex flex-wrap gap-2 items-center justify-center py-3">
                            <span class="px-3 py-1.5 rounded-lg text-[10px] font-medium" style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);color:#c084fc;">Autonomy</span>
                            <iconify-icon icon="solar:arrow-right-linear" width="12" class="text-neutral-600"></iconify-icon>
                            <span class="px-3 py-1.5 rounded-lg text-[10px] font-medium" style="background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.3);color:#fbbf24;">Motivasi Intrinsik</span>
                            <iconify-icon icon="solar:arrow-right-linear" width="12" class="text-neutral-600"></iconify-icon>
                            <span class="px-3 py-1.5 rounded-lg text-[10px] font-medium" style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);color:#60a5fa;">Deep Learning</span>
                        </div>
                        <div class="flex flex-wrap gap-2 items-center justify-center">
                            <span class="px-3 py-1.5 rounded-lg text-[10px] font-medium" style="background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);color:#4ade80;">AI Personalization</span>
                            <iconify-icon icon="solar:arrow-right-linear" width="12" class="text-neutral-600"></iconify-icon>
                            <span class="px-3 py-1.5 rounded-lg text-[10px] font-medium" style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);color:#c084fc;">Autonomy ↑</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#SDT</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#concept-map</span>
                    </div>
                </div>

                <!-- Note 6 - Daily Reflection -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="text-[10px] tag-red rounded px-2 py-0.5 uppercase tracking-widest">Reflection</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2024-01-10</span>
                    </div>
                    <h3 class="font-space text-base tracking-tight mb-3">Weekly Review — Minggu ke-2 Januari</h3>
                    <div class="text-[11px] text-neutral-400 leading-relaxed mb-4">
                        <p class="mb-2"><strong class="text-green-300">✓ Wins:</strong> Selesai baca 5 jurnal, draft BAB II progres 40%</p>
                        <p class="mb-2"><strong class="text-amber-300">⚠ Struggles:</strong> Still struggling dengan SEM analysis — perlu deep dive</p>
                        <p><strong class="text-blue-300">→ Next week:</strong> Fokus uji validitas + belajar AMOS basics</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#weekly-review</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">#reflection</span>
                    </div>
                </div>
            </div>

            <!-- Tab Content: Books -->
            <div id="tab-books" class="tab-content grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Book 1 -->
                <div class="book-card glass rounded-xl p-5 flex gap-4">
                    <div class="book-spine flex-shrink-0" style="background: linear-gradient(to bottom, #fbbf24, #f59e0b);"></div>
                    <div class="flex-1">
                        <div class="text-[10px] tag-amber rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Buku</div>
                        <h3 class="font-space text-sm tracking-tight mb-1">How to Take Smart Notes</h3>
                        <p class="text-[11px] text-neutral-500 mb-2">Sönke Ahrens · 2017</p>
                        <p class="text-[11px] text-neutral-500 leading-relaxed mb-3">Panduan lengkap metode Zettelkasten untuk menulis akademis dan berpikir kreatif.</p>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">8 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">3 highlights</span>
                            <div class="ml-auto flex items-center gap-0.5">
                                <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Book 2 -->
                <div class="book-card glass rounded-xl p-5 flex gap-4">
                    <div class="book-spine flex-shrink-0" style="background: linear-gradient(to bottom, #a855f7, #7c3aed);"></div>
                    <div class="flex-1">
                        <div class="text-[10px] tag-purple rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Buku</div>
                        <h3 class="font-space text-sm tracking-tight mb-1">Building a Second Brain</h3>
                        <p class="text-[11px] text-neutral-500 mb-2">Tiago Forte · 2022</p>
                        <p class="text-[11px] text-neutral-500 leading-relaxed mb-3">Metode PARA dan Progressive Summarization untuk manajemen pengetahuan digital.</p>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">12 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">7 highlights</span>
                            <div class="ml-auto flex items-center gap-0.5">
                                <div class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Book 3 -->
                <div class="book-card glass rounded-xl p-5 flex gap-4">
                    <div class="book-spine flex-shrink-0" style="background: linear-gradient(to bottom, #3b82f6, #2563eb);"></div>
                    <div class="flex-1">
                        <div class="text-[10px] tag-blue rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Buku</div>
                        <h3 class="font-space text-sm tracking-tight mb-1">Make It Stick: The Science of Learning</h3>
                        <p class="text-[11px] text-neutral-500 mb-2">Brown, Roediger & McDaniel · 2014</p>
                        <p class="text-[11px] text-neutral-500 leading-relaxed mb-3">Mengapa metode belajar populer sering salah dan apa yang benar-benar bekerja.</p>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">6 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">5 highlights</span>
                            <div class="ml-auto flex items-center gap-0.5">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Book 4 -->
                <div class="book-card glass rounded-xl p-5 flex gap-4">
                    <div class="book-spine flex-shrink-0" style="background: linear-gradient(to bottom, #22c55e, #16a34a);"></div>
                    <div class="flex-1">
                        <div class="text-[10px] tag-green rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Buku</div>
                        <h3 class="font-space text-sm tracking-tight mb-1">Self-Determination Theory</h3>
                        <p class="text-[11px] text-neutral-500 mb-2">Deci & Ryan · 2017</p>
                        <p class="text-[11px] text-neutral-500 leading-relaxed mb-3">Teori psikologi tentang motivasi intrinsik: autonomy, competence, relatedness.</p>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">10 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">4 highlights</span>
                            <div class="ml-auto flex items-center gap-0.5">
                                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Book 5 -->
                <div class="book-card glass rounded-xl p-5 flex gap-4">
                    <div class="book-spine flex-shrink-0" style="background: linear-gradient(to bottom, #f87171, #ef4444);"></div>
                    <div class="flex-1">
                        <div class="text-[10px] tag-red rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Buku</div>
                        <h3 class="font-space text-sm tracking-tight mb-1">Thinking, Fast and Slow</h3>
                        <p class="text-[11px] text-neutral-500 mb-2">Daniel Kahneman · 2011</p>
                        <p class="text-[11px] text-neutral-500 leading-relaxed mb-3">Dua sistem berpikir dan bagaimana bias kognitif mempengaruhi keputusan.</p>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">5 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">2 highlights</span>
                            <div class="ml-auto flex items-center gap-0.5">
                                <div class="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Book 6 -->
                <div class="book-card glass rounded-xl p-5 flex gap-4">
                    <div class="book-spine flex-shrink-0" style="background: linear-gradient(to bottom, #06b6d4, #0891b2);"></div>
                    <div class="flex-1">
                        <div class="text-[10px] tag-blue rounded inline-block px-2 py-0.5 mb-2 uppercase tracking-widest">Buku</div>
                        <h3 class="font-space text-sm tracking-tight mb-1">Atomic Habits</h3>
                        <p class="text-[11px] text-neutral-500 mb-2">James Clear · 2018</p>
                        <p class="text-[11px] text-neutral-500 leading-relaxed mb-3">Cara membangun kebiasaan baik dan menghilangkan kebiasaan buruk secara bertahap.</p>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">4 notes</span>
                            <span class="text-[10px] tag-neutral rounded px-2 py-0.5">6 highlights</span>
                            <div class="ml-auto flex items-center gap-0.5">
                                <div class="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                <div class="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Content: Journals -->
            <div id="tab-journals" class="tab-content grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Journal 1 -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] tag-blue rounded px-2 py-0.5 uppercase tracking-widest">Jurnal Q1</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2024</span>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">The Impact of Generative AI on Higher Education: A Systematic Review</h3>
                    <p class="text-[11px] text-neutral-500 mb-3">Chen, X., Zou, D., Xie, H., & Wang, F.L.</p>
                    <p class="text-[11px] text-neutral-400 leading-relaxed mb-3">Review 45 studi tentang penggunaan generative AI (ChatGPT, dll) dalam konteks pendidikan tinggi. Temuan utama: potensi besar untuk personalisasi tapi risiko integritas akademik perlu diatasi.</p>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">DOI: 10.1016/j.compedu.2024</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">5 notes</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">3 quotes</span>
                    </div>
                </div>
                <!-- Journal 2 -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] tag-purple rounded px-2 py-0.5 uppercase tracking-widest">Jurnal Q1</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2023</span>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">Self-Determination Theory in Educational Technology: A Decade Review</h3>
                    <p class="text-[11px] text-neutral-500 mb-3">Chen, J., Wang, M., & Kirschner, P.A.</p>
                    <p class="text-[11px] text-neutral-400 leading-relaxed mb-3">Meta-review 10 tahun penerapan SDT dalam edtech. Menunjukkan bahwa autonomy-supportive design secara konsisten meningkatkan motivasi intrinsik learners.</p>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">DOI: 10.1007/s11423-023</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">8 notes</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">5 quotes</span>
                    </div>
                </div>
                <!-- Journal 3 -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] tag-green rounded px-2 py-0.5 uppercase tracking-widest">Jurnal Q2</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2023</span>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">AI Tutoring Systems and Student Motivation: Meta-Analysis of 60 Studies</h3>
                    <p class="text-[11px] text-neutral-500 mb-3">Van der Kleij, F.M., Schellekens, A., & Eggen, T.</p>
                    <p class="text-[11px] text-neutral-400 leading-relaxed mb-3">Meta-analisis menunjukkan effect size d=0.42 untuk AI tutoring terhadap motivasi, lebih tinggi pada adaptive systems dibanding rule-based.</p>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">DOI: 10.1016/j.learninstruc.2023</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">4 notes</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">2 quotes</span>
                    </div>
                </div>
                <!-- Journal 4 -->
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] tag-amber rounded px-2 py-0.5 uppercase tracking-widest">Jurnal Q1</span>
                        <span class="text-[10px] text-neutral-600 font-mono">2024</span>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">Gamification in Higher Education: A Systematic Review of Empirical Studies 2018-2023</h3>
                    <p class="text-[11px] text-neutral-500 mb-3">Koivisto, J., & Hamari, J.</p>
                    <p class="text-[11px] text-neutral-400 leading-relaxed mb-3">Review 68 studi empiris. Badges dan leaderboards paling umum, tapi pointsberg triad + narrative lebih efektif untuk engagement jangka panjang.</p>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">DOI: 10.1016/j.chb.2024</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">6 notes</span>
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5">4 quotes</span>
                    </div>
                </div>
            </div>

            <!-- Tab Content: Web Clipping -->
            <div id="tab-web" class="tab-content grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5 uppercase tracking-widest">Article</span>
                        <span class="text-[10px] text-neutral-600 font-mono">notion.so</span>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">PARA Method — Complete Guide by Thomas J Frank</h3>
                    <p class="text-[11px] text-neutral-400 leading-relaxed mb-3">Panduan lengkap implementasi PARA di Notion. Covers setup, templates, dan best practices untuk personal knowledge management.</p>
                    <div class="flex items-center gap-2">
                        <iconify-icon icon="solar:global-linear" width="12" class="text-neutral-600"></iconify-icon>
                        <span class="text-[10px] text-neutral-600 truncate">thomasjfrank.com/notion-para</span>
                    </div>
                </div>
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5 uppercase tracking-widest">Video</span>
                        <span class="text-[10px] text-neutral-600 font-mono">youtube.com</span>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">How to Use Zettelkasten for Academic Writing</h3>
                    <p class="text-[11px] text-neutral-400 leading-relaxed mb-3">Tutorial 25 menit tentang cara menerapkan Zettelkasten untuk menulis paper akademis secara efisien.</p>
                    <div class="flex items-center gap-2">
                        <iconify-icon icon="solar:global-linear" width="12" class="text-neutral-600"></iconify-icon>
                        <span class="text-[10px] text-neutral-600 truncate">youtube.com/watch?v=...</span>
                    </div>
                </div>
                <div class="note-card notes-glow rounded-xl">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] tag-neutral rounded px-2 py-0.5 uppercase tracking-widest">Thread</span>
                        <span class="text-[10px] text-neutral-600 font-mono">x.com</span>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">My Complete Research Workflow with Notion + Obsidian</h3>
                    <p class="text-[11px] text-neutral-400 leading-relaxed mb-3">Seorang PhD student berbagi workflow lengkap dari literature discovery sampai writing dengan Notion sebagai PARA hub.</p>
                    <div class="flex items-center gap-2">
                        <iconify-icon icon="solar:global-linear" width="12" class="text-neutral-600"></iconify-icon>
                        <span class="text-[10px] text-neutral-600 truncate">x.com/researcher/status/...</span>
                    </div>
                </div>
            </div>

            <!-- Notes Bottom CTA -->
            <div class="reveal text-center mt-16">
                <p class="text-sm text-neutral-500 mb-4">Setiap note yang Anda buat menjadi <span class="text-amber-400">blok pengetahuan</span> yang saling terhubung — bukan sekadar teks diam.</p>
                <div class="inline-flex items-center gap-6 text-xs text-neutral-600">
                    <div class="flex items-center gap-2">
                        <iconify-icon icon="solar:link-round-bold-duotone" width="16" style="color:rgba(251,191,36,0.4);"></iconify-icon>
                        <span>Bi-directional</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <iconify-icon icon="solar:layers-bold-duotone" width="16" style="color:rgba(168,85,247,0.4);"></iconify-icon>
                        <span>Templated</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <iconify-icon icon="solar:tag-bold-duotone" width="16" style="color:rgba(59,130,246,0.4);"></iconify-icon>
                        <span>Tagged</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <iconify-icon icon="solar:magnifer-bold-duotone" width="16" style="color:rgba(34,197,94,0.4);"></iconify-icon>
                        <span>Searchable</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== ARCHIVE ==================== -->
    <section id="archive" class="relative z-10 py-24 md:py-32 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="reveal flex items-start gap-6 mb-16">
                <div class="para-indicator h-16 mt-2 flex-shrink-0" style="background: linear-gradient(to bottom, #525252, transparent);"></div>
                <div>
                    <div class="text-[10px] tracking-widest uppercase text-neutral-600 mb-3">06 / Archive</div>
                    <h2 class="font-space font-light text-4xl md:text-6xl tracking-tighter uppercase leading-none mb-4">
                        Completed<br><span class="text-neutral-600 font-semibold">Archive</span>
                    </h2>
                    <p class="text-neutral-500 text-sm max-w-lg leading-relaxed">Proyek selesai, area tidak aktif, dan referensi lama. Tidak dihapus — tetap bisa diakses kapan saja. Ini menjaga sistem Anda tetap bersih.</p>
                </div>
            </div>
            <div class="reveal glass rounded-2xl p-8 max-w-3xl" style="opacity: 0.5;">
                <div class="flex items-center gap-3 mb-6">
                    <iconify-icon icon="solar:archive-bold-duotone" width="20" style="color:#525252;"></iconify-icon>
                    <span class="text-sm font-medium text-neutral-500">Archived Items</span>
                    <span class="text-[10px] tag-neutral rounded px-2 py-0.5">14 items</span>
                </div>
                <div class="space-y-3">
                    <div class="flex items-center gap-3 px-4 py-3 rounded-lg" style="background: rgba(255,255,255,0.01);">
                        <iconify-icon icon="solar:folder-bold-duotone" width="16" style="color:#525252;"></iconify-icon>
                        <span class="text-sm text-neutral-600">Presentasi Seminar Proposal — Des 2023</span>
                        <span class="ml-auto text-[10px] text-neutral-700">Completed</span>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-3 rounded-lg" style="background: rgba(255,255,255,0.01);">
                        <iconify-icon icon="solar:folder-bold-duotone" width="16" style="color:#525252;"></iconify-icon>
                        <span class="text-sm text-neutral-600">Organisasi Dies Natalis — Nov 2023</span>
                        <span class="ml-auto text-[10px] text-neutral-700">Completed</span>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-3 rounded-lg" style="background: rgba(255,255,255,0.01);">
                        <iconify-icon icon="solar:folder-bold-duotone" width="16" style="color:#525252;"></iconify-icon>
                        <span class="text-sm text-neutral-600">Asisten Lab Semester 1 — Okt 2023</span>
                        <span class="ml-auto text-[10px] text-neutral-700">Inactive</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== NOTION INTEGRATION ==================== -->
    <section class="relative z-10 py-24 md:py-32 px-4 border-t" style="border-color: rgba(255,255,255,0.05);">
        <div class="max-w-7xl mx-auto">
            <div class="reveal text-center mb-16">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08);">
                    <iconify-icon icon="simple-icons:notion" width="14" style="color: white;"></iconify-icon>
                    <span class="text-[10px] tracking-widest uppercase text-neutral-400">Native Notion Integration</span>
                </div>
                <h2 class="font-space font-light text-4xl md:text-6xl tracking-tighter uppercase leading-none mb-4">
                    Bukan Template<br><span class="text-gradient font-semibold">Biasa</span>
                </h2>
                <p class="text-neutral-400 text-sm max-w-2xl mx-auto leading-relaxed">StudiOS dibangun secara native di Notion menggunakan fitur terkuatnya: databases, relations, rollups, dan templates — bukan sekadar halaman statis.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-1">
                <div class="reveal glass rounded-xl p-6 text-center">
                    <iconify-icon icon="solar:database-bold-duotone" width="32" class="text-purple-400 mb-3"></iconify-icon>
                    <h3 class="font-space text-sm tracking-tight mb-2">Relational Databases</h3>
                    <p class="text-[11px] text-neutral-500 leading-relaxed">Setiap PARA category adalah database yang saling terhubung. Note terkait ke Project, Project ke Tasks.</p>
                </div>
                <div class="reveal glass rounded-xl p-6 text-center" style="transition-delay: 0.1s;">
                    <iconify-icon icon="solar:calculator-bold-duotone" width="32" class="text-blue-400 mb-3"></iconify-icon>
                    <h3 class="font-space text-sm tracking-tight mb-2">Rollup & Formulas</h3>
                    <p class="text-[11px] text-neutral-500 leading-relaxed">Progress otomatis, hitung jumlah notes per project, filter by tag, sort by date — semua real-time.</p>
                </div>
                <div class="reveal glass rounded-xl p-6 text-center" style="transition-delay: 0.2s;">
                    <iconify-icon icon="solar:copy-bold-duotone" width="32" class="text-green-400 mb-3"></iconify-icon>
                    <h3 class="font-space text-sm tracking-tight mb-2">Button Templates</h3>
                    <p class="text-[11px] text-neutral-500 leading-relaxed">Satu klik untuk membuat note baru dengan format yang sudah terstruktur. Cornell, Zettelkasten, Lit Review.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== WHO IS IT FOR ==================== -->
    <section class="relative z-10 py-24 md:py-32 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="reveal text-center mb-16">
                <h2 class="font-space font-light text-4xl md:text-5xl tracking-tighter uppercase leading-none mb-4">
                    Untuk <span class="text-gradient font-semibold">Siapa?</span>
                </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                <div class="reveal glass rounded-xl p-6">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.2);">
                        <iconify-icon icon="solar:square-academic-cap-bold-duotone" width="22" style="color:#a855f7;"></iconify-icon>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">Mahasiswa</h3>
                    <p class="text-[11px] text-neutral-500 leading-relaxed">Organisir tugas, catatan kuliah, dan skripsi dalam satu sistem yang terstruktur.</p>
                </div>
                <div class="reveal glass rounded-xl p-6" style="transition-delay: 0.1s;">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2);">
                        <iconify-icon icon="solar:user-speak-bold-duotone" width="22" style="color:#3b82f6;"></iconify-icon>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">Dosen</h3>
                    <p class="text-[11px] text-neutral-500 leading-relaxed">Kelola riset, bimbingan, materi perkuliahan, dan administrasi akademik.</p>
                </div>
                <div class="reveal glass rounded-xl p-6" style="transition-delay: 0.2s;">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);">
                        <iconify-icon icon="solar:microscope-bold-duotone" width="22" style="color:#22c55e;"></iconify-icon>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">Peneliti</h3>
                    <p class="text-[11px] text-neutral-500 leading-relaxed">Systematic review, literature management, dan knowledge graph untuk riset.</p>
                </div>
                <div class="reveal glass rounded-xl p-6" style="transition-delay: 0.3s;">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2);">
                        <iconify-icon icon="solar:user-heart-bold-duotone" width="22" style="color:#fbbf24;"></iconify-icon>
                    </div>
                    <h3 class="font-space text-sm tracking-tight mb-2">Personal PKM</h3>
                    <p class="text-[11px] text-neutral-500 leading-relaxed">Siapa saja yang ingin membangun "second brain" dan sistem pengetahuan pribadi.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== FINAL CTA ==================== -->
    <section class="relative z-10 py-32 md:py-44 px-4">
        <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(124,58,237,0.08), transparent 70%);"></div>
        <div class="reveal max-w-4xl mx-auto text-center relative">
            <h2 class="font-space font-semibold text-4xl sm:text-6xl md:text-8xl tracking-tighter uppercase leading-[0.85] mb-6">
                <span class="text-gradient">Build Your</span><br>
                <span class="text-white">Second Brain</span>
            </h2>
            <p class="text-lg text-neutral-400 font-light max-w-xl mx-auto leading-relaxed tracking-tight mb-10">
                Mulai dengan StudiOS PARA Dashboard. Gratis, open-source, dan siap digunakan langsung di Notion Anda.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#" class="group flex items-center gap-3 text-xs font-bold tracking-widest uppercase px-10 py-4 rounded-xl text-white transition-all duration-300 hover:scale-105" style="background: linear-gradient(135deg, #7c3aed, #2563eb); box-shadow: 0 0 30px rgba(124,58,237,0.5);">
                    <iconify-icon icon="simple-icons:notion" width="16"></iconify-icon>
                    Duplicate ke Notion
                    <iconify-icon icon="solar:arrow-right-linear" width="16" class="transition-transform group-hover:translate-x-1"></iconify-icon>
                </a>
                <a href="#" class="group flex items-center gap-3 text-xs font-bold tracking-widest uppercase px-10 py-4 rounded-xl text-neutral-300 border transition-all duration-300 hover:border-purple-500/40 hover:text-white" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08);">
                    <iconify-icon icon="solar:play-circle-linear" width="16"></iconify-icon>
                    Watch Demo
                </a>
            </div>
            <p class="text-[10px] text-neutral-600 mt-6">Tidak perlu sign up. Tidak perlu kartu kredit. Langsung di Notion.</p>
        </div>
    </section>

    <!-- ==================== FOOTER ==================== -->
    <footer class="relative z-10 border-t py-12 px-4" style="border-color: rgba(255,255,255,0.05);">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-6 h-6 rounded flex items-center justify-center" style="background: linear-gradient(135deg, #7c3aed, #2563eb);">
                            <iconify-icon icon="solar:document-bold-duotone" width="12" style="color:white;"></iconify-icon>
                        </div>
                        <span class="font-space font-semibold text-xs tracking-tight">StudiOS</span>
                    </div>
                    <p class="text-[11px] text-neutral-600 leading-relaxed">PARA-Powered Knowledge Operating System for Notion.</p>
                </div>
                <div>
                    <div class="text-[10px] tracking-widest uppercase text-neutral-500 mb-3">PARA</div>
                    <div class="space-y-2">
                        <a href="#projects" class="block text-xs text-neutral-600 hover:text-white transition-colors">Projects</a>
                        <a href="#areas" class="block text-xs text-neutral-600 hover:text-white transition-colors">Areas</a>
                        <a href="#resources" class="block text-xs text-neutral-600 hover:text-white transition-colors">Resources</a>
                        <a href="#tasks" class="block text-xs text-neutral-600 hover:text-white transition-colors">Tasks</a>
                        <a href="#notes" class="block text-xs text-amber-400/60 hover:text-amber-400 transition-colors">Notes</a>
                        <a href="#archive" class="block text-xs text-neutral-600 hover:text-white transition-colors">Archive</a>
                    </div>
                </div>
                <div>
                    <div class="text-[10px] tracking-widest uppercase text-neutral-500 mb-3">Resources</div>
                    <div class="space-y-2">
                        <a href="#" class="block text-xs text-neutral-600 hover:text-white transition-colors">Documentation</a>
                        <a href="#" class="block text-xs text-neutral-600 hover:text-white transition-colors">Template Library</a>
                        <a href="#" class="block text-xs text-neutral-600 hover:text-white transition-colors">PARA Guide</a>
                        <a href="#" class="block text-xs text-neutral-600 hover:text-white transition-colors">Blog</a>
                    </div>
                </div>
                <div>
                    <div class="text-[10px] tracking-widest uppercase text-neutral-500 mb-3">Connect</div>
                    <div class="space-y-2">
                        <a href="#" class="block text-xs text-neutral-600 hover:text-white transition-colors">Twitter / X</a>
                        <a href="#" class="block text-xs text-neutral-600 hover:text-white transition-colors">Discord</a>
                        <a href="#" class="block text-xs text-neutral-600 hover:text-white transition-colors">GitHub</a>
                        <a href="#" class="block text-xs text-neutral-600 hover:text-white transition-colors">Email</a>
                    </div>
                </div>
            </div>
            <div class="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style="border-color: rgba(255,255,255,0.05);">
                <p class="text-[10px] text-neutral-700">© 2024 StudiOS. Built with Notion. Inspired by Thomas J Frank's PARA.</p>
                <div class="flex items-center gap-1 text-[10px] text-neutral-700">
                    <span>Made with</span>
                    <iconify-icon icon="solar:heart-bold" width="10" style="color:#a855f7;"></iconify-icon>
                    <span>for knowledge seekers</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- ==================== JAVASCRIPT ==================== -->
    <script>
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileClose = document.getElementById('mobileClose');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        mobileToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
        mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
        mobileLinks.forEach(link => link.addEventListener('click', () => mobileMenu.classList.remove('open')));

        // Tab system
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;

                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                tabContents.forEach(tc => tc.classList.remove('active'));
                document.getElementById(`tab-${tabId}`).classList.add('active');
            });
        });

        // Scroll reveal
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // Active nav link on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.para-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Task checkbox toggle (interactive demo)
        document.querySelectorAll('#tasks .w-5.h-5.rounded-md').forEach((checkbox, i) => {
            if (i < 2) return; // Skip already checked
            checkbox.style.cursor = 'pointer';
            checkbox.addEventListener('click', function() {
                const row = this.closest('.flex');
                const label = row.querySelector('span.text-sm');
                const badge = row.querySelector('span:last-child');

                if (!this.classList.contains('border-green-500')) {
                    this.classList.remove('border-amber-400', 'border-neutral-700');
                    this.classList.add('border-green-500', 'bg-green-500/20');
                    this.innerHTML = '<iconify-icon icon="solar:check-read-linear" width="12" style="color:#22c55e;"></iconify-icon>';
                    label.classList.add('line-through', 'text-neutral-500');
                    label.classList.remove('text-white', 'text-neutral-400');
                    badge.className = 'ml-auto text-[10px] tag-green rounded px-2 py-0.5 flex-shrink-0';
                    badge.textContent = 'Done';
                    row.style.background = 'rgba(255,255,255,0.02)';
                    row.style.borderColor = 'transparent';
                } else {
                    this.classList.add('border-neutral-700');
                    this.classList.remove('border-green-500', 'bg-green-500/20');
                    this.innerHTML = '';
                    label.classList.remove('line-through', 'text-neutral-500');
                    label.classList.add('text-neutral-400');
                    badge.className = 'ml-auto text-[10px] tag-neutral rounded px-2 py-0.5 flex-shrink-0';
                    badge.textContent = 'Todo';
                }
            });
        });
    </script>
</body>
</html>